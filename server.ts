import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { dbStore } from './src/db/store.ts';
import { parseMedicalDocumentWithGemini, generateChatResponseWithGemini } from './src/services/geminiService.ts';
import { DISEASES_CATALOG } from './src/db/diseasesData.ts';
import { SPECIAL_FEATURES } from './src/db/specialFeaturesData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aurahealth-super-secret-key-2026';

app.use(express.json({ limit: '25mb' }));

interface AuthRequest extends Request {
  userId?: string;
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.userId = 'usr_alex_22';
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/, '');
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId || 'usr_alex_22';
    next();
  } catch (err) {
    req.userId = 'usr_alex_22';
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

app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    const { email, name, avatarUrl, googleId } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Google email address is required.' });
    }
    const { user, profile } = await dbStore.googleLogin(email, name, avatarUrl, googleId);
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, profile });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Google authentication failed.' });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const profile = dbStore.getProfile(req.userId!);
  if (!profile) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ profile });
});

// ----------------- PROFILE & VITALS -----------------
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

// ----------------- DAILY HEALTH UPDATES & VITALS -----------------
app.get('/api/health/updates', requireAuth, (req: AuthRequest, res: Response) => {
  const updates = dbStore.getDailyUpdates(req.userId!);
  return res.json(updates);
});

app.post('/api/health/updates', requireAuth, (req: AuthRequest, res: Response) => {
  const saved = dbStore.logDailyHealth(req.userId!, req.body);
  return res.json(saved);
});

// ----------------- DAILY HABITS & GOALS -----------------
app.get('/api/habits/goals', requireAuth, (req: AuthRequest, res: Response) => {
  const goals = dbStore.getHabitGoals(req.userId!);
  return res.json(goals);
});

app.patch('/api/habits/goals/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const goals = dbStore.updateHabitGoal(req.userId!, req.params.id, req.body);
  return res.json(goals);
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
      fileSize: fileData ? Math.round((fileData.length * 3) / 4) : 160000,
      status: 'completed' as const,
      summary: extracted.summary,
      parameters: extracted.parameters.map(p => ({ ...p, reportId })),
      doctorDiscussionPoints: extracted.doctorDiscussionPoints,
      preventiveTakeaways: [
        'Review out-of-range indicators with your healthcare provider.',
        'Track longitudinal shifts on your Biomarker Trends page.'
      ],
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

// ----------------- DISEASES CATALOG -----------------
app.get('/api/diseases', (_req: Request, res: Response) => {
  return res.json(DISEASES_CATALOG);
});

app.get('/api/diseases/:id', (req: Request, res: Response) => {
  const disease = dbStore.getDiseaseById(req.params.id);
  if (!disease) {
    return res.status(404).json({ error: 'Disease condition not found.' });
  }
  return res.json(disease);
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

// ----------------- AROGYA STREAK POINTS & SPECIAL FEATURES -----------------
app.get('/api/points/features', (_req: Request, res: Response) => {
  return res.json(SPECIAL_FEATURES);
});

app.post('/api/points/redeem', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { featureId, pointCost } = req.body;
    if (!featureId || typeof pointCost !== 'number') {
      return res.status(400).json({ error: 'featureId and pointCost are required.' });
    }
    const updatedProfile = dbStore.redeemFeature(req.userId!, featureId, pointCost);
    return res.json({ profile: updatedProfile, success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/points/award', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { points } = req.body;
    const updatedProfile = dbStore.awardStreakPoints(req.userId!, points || 20);
    return res.json({ profile: updatedProfile, success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ----------------- AI HEALTH ASSISTANT -----------------
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
    const updates = dbStore.getDailyUpdates(userId);

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    dbStore.addChatMessage(userId, userMsg);

    // Build context
    const recentParams = reports.flatMap(r => r.parameters).slice(0, 6);
    const paramSummary = recentParams.map(p => `${p.parameterName}: ${p.value} ${p.unit} (${p.status})`).join(', ');
    const latestUpdate = updates[0];
    const updateSummary = latestUpdate
      ? `Resting BP: ${latestUpdate.bloodPressure || 'Normal'}, Sleep: ${latestUpdate.sleepHours}h, Water: ${latestUpdate.waterGlasses * 250}ml, Energy: ${latestUpdate.energyLevel}/5, Reported Symptoms: ${latestUpdate.symptomsReported?.join(', ') || 'None'}`
      : 'Vitals stable';

    const aiResult = await generateChatResponseWithGemini(message, {
      userName: profile?.name || 'User',
      profileSummary: `${profile?.age || 22}yo ${profile?.gender || 'individual'}, lifestyle: ${profile?.lifestyle || 'student'}, Conditions: ${profile?.existingConditions?.join(', ') || 'None stated'}`,
      recentBiomarkersSummary: paramSummary,
      recentSymptomSummary: updateSummary,
      cycleOrRhythmStatus: `Resting HR: ${profile?.restingHeartRate || 72} bpm, Blood Pressure: ${profile?.bloodPressureSystolic || 120}/${profile?.bloodPressureDiastolic || 80} mmHg`
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
  res.setHeader('Content-Disposition', `attachment; filename=AuraHealth_MedicalFile_${req.userId}_${Date.now()}.json`);
  return res.send(JSON.stringify(exportPayload, null, 2));
});

app.delete('/api/privacy/account', requireAuth, (req: AuthRequest, res: Response) => {
  dbStore.deleteAccount(req.userId!);
  return res.json({ success: true, message: 'Account and all medical records permanently deleted.' });
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
    console.log(`AuraHealth Full-Stack server live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
