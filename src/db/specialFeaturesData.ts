import { SpecialFeature } from '../types/index.ts';

export const SPECIAL_FEATURES: SpecialFeature[] = [
  {
    id: 'doctor_prep_dossier',
    name: 'Physician Consultation Dossier',
    category: 'Clinical Readiness',
    pointCost: 80,
    description: 'Generates an executive clinical summary of your flagged biomarkers, symptom history, and family risks to take directly to your doctor.',
    iconName: 'FileText',
    sampleOutputTitle: 'Physician-Ready Clinical Summary'
  },
  {
    id: 'precision_micronutrient_protocol',
    name: '7-Day Precision Micronutrient & Meal Protocol',
    category: 'Biomarker Nutrition',
    pointCost: 120,
    description: 'Custom daily nutritional roadmap designed specifically around your low Ferritin (18 ng/mL) and Vitamin D (24.2 ng/mL) with iron-absorption synergy timing.',
    iconName: 'Salad',
    sampleOutputTitle: '7-Day Targeted Biomarker Nutrition Plan'
  },
  {
    id: 'circadian_sleep_audit',
    name: 'Circadian Sleep Architecture Audit',
    category: 'Sleep Optimization',
    pointCost: 75,
    description: 'Deep audit of your 5-day sleep logs, caffeine cutoff windows, core body temperature curves, and nocturnal melatonin release timing.',
    iconName: 'Moon',
    sampleOutputTitle: 'Circadian Sleep & Recovery Audit'
  },
  {
    id: 'disease_mitigation_roadmap',
    name: 'Preventive Disease Defense Roadmap',
    category: 'Chronic Risk Shielding',
    pointCost: 100,
    description: 'Step-by-step clinical lifestyle protocol for mitigating your identified risk factors (Iron Deficiency & indoor deficiency) with re-test milestones.',
    iconName: 'ShieldAlert',
    sampleOutputTitle: 'Preventive Disease Action Protocol'
  },
  {
    id: 'differential_lab_analysis',
    name: 'Deep Clinical Second Opinion & Biomarker Cross-Correlation',
    category: 'Advanced Diagnostics',
    pointCost: 150,
    description: 'Correlates your CBC, Ferritin, and Vitamin D against reported study fatigue, stress levels, and dietary patterns to reveal secondary systemic bottlenecks.',
    iconName: 'Stethoscope',
    sampleOutputTitle: 'Differential Biomarker Correlation Review'
  },
  {
    id: 'burnout_adrenal_recovery',
    name: 'Youth Academic & Desk Burnout Recovery Protocol',
    category: 'Neuro-Metabolic Support',
    pointCost: 90,
    description: 'Evidence-based protocol for students and desk workers to lower sympathetic nervous system overdrive, regulate cortisol spikes, and optimize ocular strain.',
    iconName: 'Sparkles',
    sampleOutputTitle: 'Neuro-Metabolic Burnout Restoration Plan'
  }
];
