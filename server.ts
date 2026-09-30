import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { dbStore } from './src/db/store.ts';
import { parseMedicalDocumentWithGemini, generateChatResponseWithGemini } from './src/services/geminiService.ts';
import { HEALTH_STORIES } from './src/db/knowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aurahealth-super-secret-key-2026';

app.use(express.json({ limit: '25mb' }));

// Auth token middleware
interface AuthRequest extends Request {
  userId?: string;
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default to the active seeded user for frictionless demo experience if no header
    req.userId = 'usr_maya_22';
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/, '');
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId || 'usr_maya_22';
    next();
  } catch (err) {
    // Fallback to active demo user
    req.userId = 'usr_maya_22';
    next();
  }
}

// ----------------- AUTH ENDPOINTS -----------------
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide email, password, and name.' });
    }
    const { user, profile } = await dbStore.register(email, password, name);
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, profile });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }
    const { user, profile } = await dbStore.login(email, password);
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, profile });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Invalid credentials.' });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const profile = dbStore.getProfile(req.userId!);
  if (!profile) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ profile });
});

// ----------------- PROFILE ENDPOINTS -----------------
app.get('/api/profile', requireAuth, (req: AuthRequest, res: Response) => {
  const profile = dbStore.getProfile(req.userId!);
  return res.json(profile);
});

app.put('/api/profile', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const updated = dbStore.updateProfile(req.userId!, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ----------------- SYMPTOMS & DAILY CHECK-IN -----------------
app.get('/api/symptoms', requireAuth, (req: AuthRequest, res: Response) => {
  const logs = dbStore.getSymptomLogs(req.userId!);
  return res.json(logs);
});

app.post('/api/symptoms', requireAuth, (req: AuthRequest, res: Response) => {
  const saved = dbStore.logSymptoms(req.userId!, req.body);
  return res.json(saved);
});

// ----------------- MEDICAL REPORTS & OCR -----------------
app.get('/api/reports', requireAuth, (req: AuthRequest, res: Response) => {
  const reports = dbStore.getReports(req.userId!);
  return res.json(reports);
});

app.get('/api/reports/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const report = dbStore.getReportById(req.userId!, req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  return res.json(report);
});

app.post('/api/reports/upload', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { fileData, fileName, mimeType, title } = req.body;
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required.' });
    }

    // Call server-side Gemini 3.8 Flash OCR & extraction
    const extracted = await parseMedicalDocumentWithGemini(
      fileData || '',
      mimeType || 'application/pdf',
      fileName
    );

    const reportId = `rep_${Date.now()}`;
    const newReport = {
      id: reportId,
      userId: req.userId!,
      title: title || extracted.title,
      reportType: extracted.reportType,
      reportDate: extracted.reportDate,
      fileName,
      fileSize: fileData ? Math.round((fileData.length * 3) / 4) : 150000,
      status: 'completed' as const,
      summary: extracted.summary,
      parameters: extracted.parameters.map(p => ({ ...p, reportId })),
      doctorDiscussionPoints: extracted.doctorDiscussionPoints,
      createdAt: new Date().toISOString()
    };

    const saved = dbStore.saveReport(req.userId!, newReport);
    return res.json(saved);
  } catch (err: any) {
    console.error('Report upload error:', err);
    return res.status(500).json({ error: err.message || 'Report processing failed.' });
  }
});

app.delete('/api/reports/:id', requireAuth, (req: AuthRequest, res: Response) => {
  dbStore.deleteReport(req.userId!, req.params.id);
  return res.json({ success: true });
});

// ----------------- BIOMARKER TRENDS -----------------
app.get('/api/trends', requireAuth, (req: AuthRequest, res: Response) => {
  const query = (req.query.parameter as string) || undefined;
  const history = dbStore.getBiomarkerHistory(req.userId!, query);
  return res.json(history);
});

// ----------------- WELLNESS PLANS & ROUTINES -----------------
app.get('/api/wellness/plan', requireAuth, (req: AuthRequest, res: Response) => {
  const plan = dbStore.getWellnessPlan(req.userId!);
  return res.json(plan);
});

app.post('/api/wellness/plan/routine/toggle', requireAuth, (req: AuthRequest, res: Response) => {
  const { routineId } = req.body;
  if (!routineId) {
    return res.status(400).json({ error: 'routineId is required.' });
  }
  const updated = dbStore.toggleRoutineItem(req.userId!, routineId);
  return res.json(updated);
});

// ----------------- REMINDERS -----------------
app.get('/api/reminders', requireAuth, (req: AuthRequest, res: Response) => {
  const list = dbStore.getReminders(req.userId!);
  return res.json(list);
});

app.post('/api/reminders', requireAuth, (req: AuthRequest, res: Response) => {
  const created = dbStore.addReminder(req.userId!, req.body);
  return res.json(created);
});

app.patch('/api/reminders/:id/toggle', requireAuth, (req: AuthRequest, res: Response) => {
  const list = dbStore.toggleReminder(req.userId!, req.params.id);
  return res.json(list);
});

app.delete('/api/reminders/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const list = dbStore.deleteReminder(req.userId!, req.params.id);
  return res.json(list);
});

// ----------------- HEALTH STORIES & GUIDES -----------------
app.get('/api/stories', (_req: Request, res: Response) => {
  return res.json(HEALTH_STORIES);
});

app.get('/api/stories/:id', (req: Request, res: Response) => {
  const story = HEALTH_STORIES.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: 'Story not found.' });
  }
  return res.json(story);
});

// ----------------- AI COMPANION CHAT -----------------
app.get('/api/chat/history', requireAuth, (req: AuthRequest, res: Response) => {
  const messages = dbStore.getChatMessages(req.userId!);
  return res.json(messages);
});

app.post('/api/chat', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const userId = req.userId!;
    const profile = dbStore.getProfile(userId);
    const reports = dbStore.getReports(userId);
    const logs = dbStore.getSymptomLogs(userId);

    // Save user message
    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    dbStore.addChatMessage(userId, userMsg);

    // Build context summary for Gemini
    const recentParams = reports.flatMap(r => r.parameters).slice(0, 5);
    const paramSummary = recentParams.map(p => `${p.parameterName}: ${p.value} ${p.unit} (${p.status})`).join(', ');
    const latestLog = logs[0];
    const logSummary = latestLog
      ? `Sleep: ${latestLog.sleepHours}h, Mood: ${latestLog.mood}, Stress: ${latestLog.stressLevel}/5, Fatigue: ${latestLog.fatigueLevel}/5`
      : 'No recent log';

    let cycleStatus = 'Circadian energy focus';
    if (profile?.trackingMode === 'cycle_and_wellness' && profile.lastPeriodStartDate) {
      const daysDiff = Math.floor((Date.now() - new Date(profile.lastPeriodStartDate).getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = (daysDiff % (profile.cycleLengthDays || 28)) + 1;
      cycleStatus = `Cycle Day ${cycleDay} of ${profile.cycleLengthDays || 28} (Estrogen/Ovulation window)`;
    }

    const aiResult = await generateChatResponseWithGemini(message, {
      userName: profile?.name || 'Friend',
      profileSummary: `${profile?.age || 21}yo ${profile?.gender || 'individual'}, lifestyle: ${profile?.lifestyle || 'student'}`,
      recentBiomarkersSummary: paramSummary,
      recentSymptomSummary: logSummary,
      cycleOrRhythmStatus: cycleStatus
    });

    const assistantMsg = {
      id: `asst_${Date.now()}`,
      sender: 'assistant' as const,
      content: aiResult.replyText,
      timestamp: new Date().toISOString(),
      citations: aiResult.citations,
      isRedFlagWarning: aiResult.isRedFlag
    };
    dbStore.addChatMessage(userId, assistantMsg);

    return res.json(assistantMsg);
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'Chat generation failed.' });
  }
});

app.delete('/api/chat/history', requireAuth, (req: AuthRequest, res: Response) => {
  dbStore.clearChat(req.userId!);
  return res.json({ success: true });
});

// ----------------- PRIVACY & DATA EXPORT -----------------
app.get('/api/privacy/export', requireAuth, (req: AuthRequest, res: Response) => {
  const exportPayload = dbStore.exportData(req.userId!);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=AuraHealth_UserData_${req.userId}_${Date.now()}.json`);
  return res.send(JSON.stringify(exportPayload, null, 2));
});

app.delete('/api/privacy/account', requireAuth, (req: AuthRequest, res: Response) => {
  dbStore.deleteAccount(req.userId!);
  return res.json({ success: true, message: 'Your account and all associated health data have been permanently deleted.' });
});

// ----------------- VITE INTEGRATION -----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AuraHealth backend & frontend server live at http://0.0.0.0:${PORT}`);
  });
}

startServer();
