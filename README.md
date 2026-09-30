# AuraHealth — Youth Health, Disease Prevention, Medical Reports & Daily Habits

AuraHealth is an enterprise-grade, preventive health assistant designed for students and young adults (ages 16–50). It prioritizes **real-world health updates, chronic disease awareness, laboratory report intelligence, and consistent daily habits**, avoiding clinical intimidation while maintaining medical accuracy and strict privacy.

---

## 4 Core Pillars

### 1. Normal Health Updates & Clinical Vitals
- **Vitals Cockpit**: Track Resting Blood Pressure (systolic/diastolic mmHg), Resting Heart Rate (bpm), Body Mass Index (BMI) & Weight (kg), and Daily Energy/Stress ratings.
- **Daily Health Updates Modal**: Log blood pressure readings, resting pulse, energy scores, sleep duration, hydration glasses, activity minutes, screen time hours, and physical symptoms experienced today.
- **Cross-Correlated Health Briefing**: Synthesizes vitals, lab reports, and habit consistency into clear preventive insights.

### 2. Youth Disease & Preventive Health Radar
- **Comprehensive Disease Directory**: Evidence-based guides for conditions common in students and young professionals:
  - *Iron Deficiency & Anemia* (Hemoglobin, Serum Ferritin, MCV)
  - *Vitamin D & B12 Deficiencies* (25-OH Vitamin D, Cobalamin)
  - *Pre-Diabetes & Insulin Resistance* (Fasting Blood Sugar, HbA1c, TG/HDL ratio)
  - *Dyslipidemia & Early Cardiovascular Risk* (LDL-C, Triglycerides, HDL-C)
  - *Early Hypertension* (Blood Pressure, Sodium, Stress response)
  - *Thyroid Disorders (Hypothyroidism & Hyperthyroidism)* (TSH, Free T4, TPO Antibodies)
  - *Fatty Liver Disease (NAFLD / MAFLD)* (ALT, AST, Hepatic ultrasound)
  - *GERD (Acid Reflux) & Irritable Bowel Syndrome (IBS)* (Digestive motility, late dinners)
  - *Migraines & Tension Headaches* (20-20-20 screen protocol, suboccipital strain)
  - *Chronic Academic Burnout & Anxiety* (Cortisol, autonomic balance, sleep recovery)
- **Diagnostic Lab Test Mapping**: Explains which laboratory biomarkers to monitor for each condition.
- **Red-Flag Warning Signs**: Clear clinical indications when to seek immediate medical or emergency care.

### 3. Medical Report Intelligence & Multimodal OCR
- **Document Ingestion**: Upload lab reports (PDF, PNG, JPG) from Quest Diagnostics, Labcorp, Hospital, or Campus Clinics.
- **Server-Side Gemini 3.8 Flash OCR**: Accurately extracts parameter names, numeric values, units, reference intervals, and status flags (Optimal, Low, High, Borderline).
- **Plain-Language Explanations**: Connects laboratory values to daily life (e.g. low ferritin explaining afternoon study exhaustion).
- **Questions for Your Doctor**: Actionable, respectful questions to bring to clinical consultations.
- **Longitudinal Trend Tracking**: Plot biomarkers over multiple test dates with shaded normal reference bands.

### 4. Daily Habit System & Automation
- **Habit Streaks**: Multi-day streak tracking for Hydration, Sleep Duration, Physical Movement, Digital Screen Curfew, and Supplement/Medication Adherence.
- **Interactive Habit Panels**:
  - *Hydration Tank*: Visual progress bar, target tracking (e.g. 2,500 ml), quick `+ 1 Glass (250ml)` button.
  - *Sleep Architecture*: Duration slider, bedtime target, 5-star quality rating.
  - *Physical Movement*: Minutes tracker and activity type selector (Brisk walking, Running, Gym, Cycling, Yoga).
  - *Screen Time & Digital Curfew*: Monitor laptop/phone hours with 20-20-20 eye break reminders.
  - *Supplements & Medications*: Daily checklist (Iron + Vit C, Vitamin D3, Magnesium, Omega-3, Multivitamin).
- **Automated Reminders**: Custom reminder scheduling with toggle controls.

---

## Security, Privacy & Confidentiality

- **Confidential Screen Mask**: 1-click blur filter across all sensitive health vitals, lab readings, and symptom notes.
- **Anonymous Mode**: Masks personal identification across all views.
- **Optional 4-Digit Passcode PIN**.
- **One-Click JSON Data Export**: Complete data portability.
- **Permanent Account Wipe**: Full cascading deletion of all medical records and logs.

---

## Local Development & Deployment

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
