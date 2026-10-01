# AuraHealth — Preventive Health & Biomarker Intelligence Platform

**AuraHealth** is an AI-powered preventive health intelligence platform built for modern individuals, students, and busy professionals. It combines real-time vitals tracking, intelligent medical report parsing, longitudinal biomarker decline detection, and actionable habit coaching into an intuitive, zero-jargon experience.

---

## 🚀 Startup Highlights & Core Features

### 1. Daily Vitals & Longitudinal Tracking
- **Smart Body Battery**: Real-time energy score derived from sleep duration, resting heart rate, and hydration.
- **Vitals Overview**: Blood pressure (systolic/diastolic), resting heart rate, weight, and stress levels.
- **7-Day Longitudinal Trend Surveillance**: Automatically monitors sleep, hydration, and vitality trends to catch downward drifts before symptoms escalate.

### 2. 7-Day Biomarker Decline Alert System
- **Longitudinal Linear Regression Engine**: Detects multi-day drops in sleep hours, hydration, and energy ratings.
- **Clear Everyday Language**: Replaces intimidating medical jargon with short, actionable terms.
- **1-Click Recovery Actions**: Quick logging (+1 glass of water), circadian bedtime reminders, and tailored recovery plans.

### 3. Medical Report Intelligence (PDF & Images)
- **Multimodal Lab Report Extraction**: Powered by Google Gemini 3 models to parse Complete Blood Count (CBC), Serum Ferritin, 25-OH Vitamin D, Lipid Profiles, and Thyroid Panels.
- **Plain-English Explanations**: Explains biological mechanisms and youth relevance without frightening clinical terminology.
- **Doctor Discussion Points**: Suggests specific questions to bring to your next healthcare visit.

### 4. Emergency Care & Hospital Finder
- **Real-Time Nearby Facilities**: Uses Google Maps and Search grounding to identify 24/7 emergency rooms, trauma centers, walk-in clinics, and pathology labs.
- **One-Tap Emergency Calling**: Quick access to national helplines (112, 108, 988, 102) and personal emergency contacts.

### 5. Habit Streaks & Gamified Wellness
- **Weekly Achievement Path**: Daily health check-in milestones with streak counters and crown badges.
- **Rewards System**: Earn wellness points for consistent hydration and sleep habits, redeemable for fitness rewards.

### 6. HIPAA & Privacy Isolation
- Client-side privacy masking mode.
- Local and encrypted biomarker storage.
- Full data export and account wipe capabilities.

---

## 🛠️ Hybrid Tech Stack Architecture

AuraHealth is built on a high-performance **Hybrid Architecture**:

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **AI & ML Engine**:
  - **Python 3.10**: Longitudinal linear regression engine (`python/biomarker_analytics.py`), clinical symptom triaging (`python/symptom_triage.py`), and LangChain pipelines.
  - **Google GenAI SDK**: Multimodal Gemini 3.5 Flash models for document parsing, reasoning, and search grounding.
- **Database & State**: In-memory + persistent JSON store with JWT authentication.

---

## 📦 Local Installation & Setup

### Prerequisites
- **Node.js**: v18.x or v20.x
- **Python**: 3.10+
- **npm** or **pnpm**

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd aurahealth

# Install Node dependencies
npm install

# Setup Python dependencies
pip install langchain-core pydantic requests
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `GEMINI_API_KEY` is set in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🐙 Pushing to Your GitHub Repository

To push this codebase to a new GitHub repository:

1. **Create a new repository** on [github.com/new](https://github.com/new) (e.g. `aurahealth-app`).
2. Run the following commands in your terminal:

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push the main branch
git branch -M main
git push -u origin main
```

---

## 🔒 Security & Medical Disclaimer

*AuraHealth is a preventive lifestyle and health education tool. It does not replace professional medical diagnosis, emergency triage, or clinical prescriptions. Always consult a qualified medical professional for acute symptoms or changes to medication.*
