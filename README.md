# AuraHealth — GenAI-Powered Youth Health & Wellness Ecosystem

AuraHealth is a preventive health intelligence, laboratory report comprehension, and holistic wellness platform designed for students and young adults (ages 16–50). Inspired by the intimacy, cycle syncing, and predictive body tracking of applications like **Flo**, AuraHealth expands the boundaries into a comprehensive, multi-dimensional health sanctuary for all youth.

---

## Key Features

1. **Flo-Inspired Biological & Circadian Rhythm Engine**
   - **Cycle Tracking Mode**: Real-time cycle day calculation, phase visualization (Menstrual, Follicular, Ovulation Window, Luteal Phase), energy predictions, and symptom patterns.
   - **Circadian Energy Mode**: For non-cycling individuals or general wellness, tracking the 24-hour diurnal curve (Cortisol awakening, peak prefrontal cortex focus, post-lunch metabolic dip, evening melatonin wind-down).
   - Instant toggle between tracking modes.

2. **Daily Symptom & Feeling Check-In**
   - Log mood (peaceful, energetic, focused, anxious, irritable, low, stressed).
   - Physical sensations: Cramps, acne/skin complexion, digestive bloating, headaches.
   - Sleep hours & restorative quality rating.
   - Hydration meter with 1-click `+ Drink 1 Glass (250ml)`.
   - Exercise minutes & movement tracking.
   - Pill and supplement checklist (Iron + Vitamin C, Vitamin D3, Magnesium, Omega-3, Multivitamin).
   - Encrypted personal diary notes.

3. **Medical Report Intelligence & Multimodal OCR**
   - Upload blood tests, CBC, Vitamin D/B12, thyroid, or metabolic reports (PDF, PNG, JPG).
   - Server-side **Gemini 3.8 Flash** multimodal OCR extracts exact parameter names, numerical values, units, reference intervals, and status flags.
   - Plain-language explanations of what each biomarker means for young adults.
   - Tailored questions to bring to your doctor or campus health provider.
   - Demo test loaders for instant testing.

4. **Longitudinal Biomarker Visualizer**
   - Chronological parameter timelines (Hemoglobin, Serum Ferritin, 25-OH Vitamin D, Fasting Glucose, TSH).
   - Reference interval shaded bands to visually show movement toward or away from optimal zones.
   - Percentage delta comparisons between sequential tests.

5. **24-Hour Circadian Routine & Habit Automation**
   - Actionable micro-habits divided into Morning, Midday Focus, Evening Movement, and Nocturnal Wind-Down.
   - Interactive completion tracking with real-time adherence scoring.
   - Automated smart reminders (Hydration reset, Iron + Vitamin C timing, 20-20-20 screen break, evening digital curfew).

6. **Curated Youth Health Stories & Scientific Library**
   - Bite-sized, evidence-based articles citing NIH, WHO, ACOG, and BMJ on youth-relevant topics (student iron deficiency vs burnout, hormone cycle syncing, digital eye strain, gut-skin axis).

7. **Context-Grounded AI Health Companion**
   - Conversational assistant powered by **Gemini 3.8 Flash** with access to your uploaded biomarkers, cycle phase, and symptom logs.
   - Non-diagnostic constitutional safety boundaries and citations.
   - Automatic red-flag emergency detection for acute symptoms.

8. **Confidentiality, Trust & Privacy Shield**
   - **Confidential Screen Mask**: Instant blur filter across sensitive health data to prevent shoulder-surfing in libraries and public areas.
   - **Anonymous Mode**: Masks personal identity across all views.
   - **Optional 4-Digit Access PIN**.
   - **One-Click JSON Data Export**: Complete data portability.
   - **One-Click Account & Data Purge**: Permanent cascading deletion.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (v4), Lucide Icons, Motion.
- **Backend**: Express, Node.js (`tsx`), bcryptjs, jsonwebtoken.
- **AI Engine**: `@google/genai` TypeScript SDK using `gemini-3.8-flash` on the server.
- **Design Constitution**: Zero-pill metadata discipline, 3-zone top navigation contract, 60-30-10 color distribution, tabular numerals, mobile-responsive layout.

---

## Local Development & Deployment

### 1. Prerequisites
- Node.js 20+
- A Google Gemini API Key configured in your environment (`GEMINI_API_KEY`)

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```bash
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

### 3. Running the Application
```bash
# Install dependencies
npm install

# Start development full-stack server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
