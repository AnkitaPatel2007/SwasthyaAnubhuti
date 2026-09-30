import { HealthStory } from '../types/index.ts';

export interface BiomarkerKnowledge {
  parameterName: string;
  category: 'hematology' | 'vitamins_minerals' | 'endocrine' | 'lipids' | 'metabolic';
  typicalUnits: string[];
  referenceRangeText: string;
  defaultMin: number;
  defaultMax: number;
  plainMeaning: string;
  youthRelevance: string;
  commonLowReasons: string;
  commonHighReasons: string;
  lifestyleTips: string[];
  verifiedSources: string;
}

export const BIOMARKER_KNOWLEDGE: Record<string, BiomarkerKnowledge> = {
  hemoglobin: {
    parameterName: 'Hemoglobin (Hb)',
    category: 'hematology',
    typicalUnits: ['g/dL', 'g/L'],
    referenceRangeText: '12.0 - 15.5 g/dL (Females), 13.8 - 17.2 g/dL (Males)',
    defaultMin: 12.0,
    defaultMax: 16.0,
    plainMeaning: 'The iron-rich protein in red blood cells that carries vital oxygen from your lungs to your brain and working muscles.',
    youthRelevance: 'Low hemoglobin causes persistent academic fatigue, dizziness when standing up quickly, pale lips/skin, and shortness of breath during casual stairs climbing.',
    commonLowReasons: 'Heavy menstrual bleeding, low dietary iron intake (common in student vegan/vegetarian diets), inadequate calorie intake, or poor gut iron absorption.',
    commonHighReasons: 'Mild dehydration (concentrates blood), living at high altitudes, or intense smoking/vaping.',
    lifestyleTips: [
      'Pair plant-based iron foods (lentils, spinach, tofu) with Vitamin C (citrus, bell peppers) to boost absorption by up to 300%.',
      'Avoid drinking coffee or tea within 1 hour of iron-rich meals (tannins block iron absorption).',
      'If menstruating heavily, discuss ferritin & iron stores with your clinician.'
    ],
    verifiedSources: 'World Health Organization (WHO) Nutritional Anemia Guidelines, NIH MedlinePlus'
  },
  ferritin: {
    parameterName: 'Serum Ferritin',
    category: 'vitamins_minerals',
    typicalUnits: ['ng/mL', 'mcg/L'],
    referenceRangeText: '20 - 200 ng/mL (Optimal for energy: >40 ng/mL)',
    defaultMin: 20,
    defaultMax: 200,
    plainMeaning: 'Your body’s iron storage bank. Even if regular hemoglobin is normal, low ferritin means your reserve tank is running on empty.',
    youthRelevance: 'One of the most frequently missed causes of young adult "chronic brain fog", brittle nails, unexplained hair shedding, and post-workout exhaustion.',
    commonLowReasons: 'Gradual iron loss through menstrual cycles, endurance running/athletics, or low dietary heme-iron.',
    commonHighReasons: 'Acute systemic inflammation, recent viral illness, or metabolic liver stress.',
    lifestyleTips: [
      'Focus on iron-rich meal timing and ask your doctor if gentle elemental iron or chelated iron is indicated.',
      'Check iron levels alongside a full CBC annually if you follow plant-forward diets.'
    ],
    verifiedSources: 'American Society of Hematology, British Medical Journal (BMJ) Iron Deficiency in Adolescents'
  },
  vitamin_d: {
    parameterName: '25-Hydroxy Vitamin D',
    category: 'vitamins_minerals',
    typicalUnits: ['ng/mL', 'nmol/L'],
    referenceRangeText: '30.0 - 100.0 ng/mL (Optimal: 40 - 60 ng/mL)',
    defaultMin: 30.0,
    defaultMax: 100.0,
    plainMeaning: 'A critical steroid pre-hormone synthesized in skin exposed to sunlight that controls bone density, immune response, and dopamine/serotonin synthesis.',
    youthRelevance: 'Over 60% of students and young desk workers are deficient due to indoor study, library hours, and seasonal lack of direct sun exposure. Causes seasonal mood dips, muscle weakness, and frequent colds.',
    commonLowReasons: 'Indoor lifestyle, sunscreen use, living in northern latitudes during winter, darker skin tones requiring more UV exposure.',
    commonHighReasons: 'Excessive high-dose mega-supplementation without medical monitoring.',
    lifestyleTips: [
      'Get 15-20 minutes of midday natural sunlight on forearms/face without sunglasses when UV index is 3+.',
      'Incorporate fortified plant or dairy milks, wild salmon, and egg yolks.',
      'Consider a daily maintenance dose (1,000–2,000 IU D3 with K2) especially in winter months.'
    ],
    verifiedSources: 'Endocrine Society Clinical Practice Guidelines, Harvard T.H. Chan School of Public Health'
  },
  vitamin_b12: {
    parameterName: 'Vitamin B12 (Cobalamin)',
    category: 'vitamins_minerals',
    typicalUnits: ['pg/mL', 'pmol/L'],
    referenceRangeText: '200 - 900 pg/mL',
    defaultMin: 200,
    defaultMax: 900,
    plainMeaning: 'Essential nutrient for nerve myelin sheath protection, memory recall, and red blood cell production.',
    youthRelevance: 'Key for students needing rapid cognitive processing. Deficiency leads to tingling in fingers/toes, extreme memory sluggishness, and low mood.',
    commonLowReasons: 'Strict vegan or vegetarian lifestyle without supplementation, acid reflux medications (PPIs) decreasing stomach acid.',
    commonHighReasons: 'Recent multivitamin injection or supplement intake.',
    lifestyleTips: [
      'Anyone following a plant-based diet should take a sublingual methylcobalamin supplement or nutritional yeast regularly.'
    ],
    verifiedSources: 'NIH Office of Dietary Supplements, European Journal of Clinical Nutrition'
  },
  tsh: {
    parameterName: 'Thyroid Stimulating Hormone (TSH)',
    category: 'endocrine',
    typicalUnits: ['uIU/mL', 'mIU/L'],
    referenceRangeText: '0.45 - 4.50 uIU/mL (Optimal youth range: 1.0 - 2.5 uIU/mL)',
    defaultMin: 0.45,
    defaultMax: 4.5,
    plainMeaning: 'The master pituitary signal directing your thyroid gland how quickly or slowly to run your metabolism, body temperature, and heart rate.',
    youthRelevance: 'Subclinical hypothyroidism is common in young adults, causing cold sensitivity, unprovoked weight gain, irregular menstrual cycles, and morning sluggishness.',
    commonLowReasons: 'Overactive thyroid (hyperthyroidism), intense acute stress.',
    commonHighReasons: 'Underactive thyroid (hypothyroidism), Hashimoto autoimmune thyroiditis, chronic severe caloric restriction.',
    lifestyleTips: [
      'Ensure adequate iodine (iodized salt, sea vegetables) and selenium (1-2 Brazil nuts per day).',
      'If TSH is borderline high, request Free T4 and Thyroid Peroxidase (TPO) antibodies from your doctor.'
    ],
    verifiedSources: 'American Thyroid Association (ATA), ACOG Endocrine Guidelines'
  },
  fasting_glucose: {
    parameterName: 'Fasting Blood Glucose',
    category: 'metabolic',
    typicalUnits: ['mg/dL', 'mmol/L'],
    referenceRangeText: '70 - 99 mg/dL (Normal fasting)',
    defaultMin: 70,
    defaultMax: 99,
    plainMeaning: 'The level of immediate sugar in your bloodstream after an 8–12 hour fast.',
    youthRelevance: 'Helps detect early insulin resistance often paired with PCOS, irregular sleep schedules, sweet cravings, and energy crashes after high-carb meals.',
    commonLowReasons: 'Excessive fasting, reactive hypoglycemia after refined sugar spikes, extreme endurance exercise.',
    commonHighReasons: 'Pre-diabetes, late-night high sugar binge, high acute cortisol from exam stress.',
    lifestyleTips: [
      'Order of eating matters: eat fiber/vegetables and protein first before starches to flatten glucose spikes by up to 40%.',
      'Take a 10-minute post-meal stroll to stimulate GLUT4 receptors in leg muscles without insulin.'
    ],
    verifiedSources: 'American Diabetes Association (ADA) Standards of Care'
  },
  ldl_cholesterol: {
    parameterName: 'LDL Cholesterol',
    category: 'lipids',
    typicalUnits: ['mg/dL', 'mmol/L'],
    referenceRangeText: '< 100 mg/dL (Desirable)',
    defaultMin: 0,
    defaultMax: 100,
    plainMeaning: 'Low-Density Lipoprotein that transports cholesterol particles throughout your vascular system.',
    youthRelevance: 'Cardiovascular prevention begins in early 20s. Elevated LDL in youth is often tied to fast-food reliance, high saturated fats, or familial hypercholesterolemia.',
    commonLowReasons: 'Malnutrition, liver dysfunction.',
    commonHighReasons: 'Diet high in trans/saturated fats, genetics, sedentary habits.',
    lifestyleTips: [
      'Increase soluble fiber (oats, chia seeds, beans, apples) which binds cholesterol in the digestive tract.',
      'Substitute butter and coconut oil with extra virgin olive oil and avocado.'
    ],
    verifiedSources: 'American Heart Association (AHA) Prevention Guidelines'
  }
};

export const HEALTH_STORIES: HealthStory[] = [
  {
    id: 'story-1',
    title: 'The Student Fatigue Puzzle: Why Sleep Isn’t Always the Fix',
    category: 'Fatigue & Blood Health',
    readTime: '3 min read',
    summary: 'Sleeping 9 hours but still waking up exhausted? Uncover the subtle trio: Ferritin, Vitamin D, and Cortisol rhythms.',
    evidenceSource: 'British Medical Journal & NIH Clinical Sleep Medicine',
    highlightMetric: 'Ferritin & Vitamin D',
    tags: ['Fatigue', 'Iron Deficiency', 'Student Wellness'],
    contentMarkdown: `
### Beyond Just "Tiredness"
It is common for college students and young professionals to assume that exhaustion is simply a lack of hours in bed. Yet clinical lab data reveals that over 38% of young adults with persistent brain fog actually have **subclinical iron deficiency** (Serum Ferritin < 30 ng/mL) or **Vitamin D insufficiency** (< 25 ng/mL).

#### What to Check:
1. **Serum Ferritin**: Tests your iron storage tank. Even if your standard Hemoglobin looks normal, empty iron reserves prevent your cells' mitochondria from producing ATP (energy).
2. **Thyroid Stimulating Hormone (TSH)**: A sluggish thyroid can simulate burnout and clinical depression.
3. **Electrolyte & Hydration Status**: Mild 2% cellular dehydration impairs cognitive focus by 15%.

#### Actionable Micro-Habit:
If you feel tired upon waking, get 5–10 minutes of direct morning sunlight into your eyes before checking your phone, and drink 500ml of water with a pinch of sea salt.
    `
  },
  {
    id: 'story-2',
    title: 'Hormones & Energy: Syncing Your Workouts with Your Cycle',
    category: 'Cycle & Hormones',
    readTime: '4 min read',
    summary: 'How estrogen and progesterone shift your metabolism, pain tolerance, and recovery across the 4 phases.',
    evidenceSource: 'American College of Obstetricians and Gynecologists (ACOG)',
    highlightMetric: 'Follicular vs Luteal',
    tags: ['Cycle Syncing', 'Estrogen', 'Workouts', 'Flo Inspired'],
    contentMarkdown: `
### Understanding Your Infradian Rhythm
Just as everyone has a 24-hour circadian rhythm, cycling individuals have a ~28-day infradian rhythm that shifts metabolism, resting temperature, and neurotransmitters.

#### Phase by Phase:
- **Phase 1: Menstrual (Days 1–5)**: Hormones are at their lowest baseline. Focus on gentle movement (walking, yin yoga), iron-rich soups, and nervous system rest.
- **Phase 2: Follicular (Days 6–12)**: Estrogen climbs steadily. Brain plasticity, social energy, and insulin sensitivity are highest. Best time for challenging projects and HIIT/strength workouts.
- **Phase 3: Ovulation (Days 13–15)**: Peak estrogen and mild testosterone boost. Peak endurance, elevated confidence, but joint laxity increases (warm up knees/ankles thoroughly).
- **Phase 4: Luteal (Days 16–28)**: Progesterone dominates. Resting metabolic rate increases by 100–300 calories/day, but cortisol sensitivity is higher. Favor steady-state cardio, complex carbs, and magnesium.
    `
  },
  {
    id: 'story-3',
    title: 'Screen-Induced Brain Drain: The 20-20-20 Rule for Focus',
    category: 'Sleep & Mind',
    readTime: '2 min read',
    summary: 'Combat digital eye strain, blue light melatonin suppression, and desk posture tension during exam or work sprints.',
    evidenceSource: 'American Academy of Ophthalmology',
    highlightMetric: 'Melatonin & Circadian',
    tags: ['Screen Time', 'Deep Work', 'Sleep'],
    contentMarkdown: `
### Digital Eye Strain & Evening Melatonin
Staring at laptops and phones reduces our blink rate from ~18 times per minute to just 5. This causes dry cornea, tension headaches, and sympathetic nervous system overdrive.

#### The 20-20-20 Protocol:
Every **20 minutes**, look away at an object at least **20 feet away** for at least **20 seconds**. This allows the ciliary eye muscles to relax and resets your autonomic stress response.

#### Nighttime Digital Curfew:
Blue light from screens directly suppresses melatonin release by up to 85%, shifting your circadian clock by 1.5 hours later. Switch screens to night-shift amber mode at sundown.
    `
  },
  {
    id: 'story-4',
    title: 'Clear Skin from the Inside: The Gut-Skin Connection',
    category: 'Skin & Gut',
    readTime: '3 min read',
    summary: 'Why sudden adult breakouts often mirror late-night sugar, dairy sensitivities, or elevated cortisol.',
    evidenceSource: 'Journal of the American Academy of Dermatology',
    highlightMetric: 'Insulin & Cortisol',
    tags: ['Acne', 'Gut Health', 'Diet'],
    contentMarkdown: `
### The Hormonal-Gut Axis
Acne in young adults (ages 18–35) is rarely just about topical cleanliness. High glycemic index meals trigger sharp spikes in insulin and IGF-1 (Insulin-like Growth Factor 1), stimulating excess sebum production and pore clogging.

#### Key Gut Factors:
- **Refined Sugar & Whey Protein**: Both trigger substantial insulin spikes that activate androgen pathways in skin sebocytes.
- **Sleep Quality**: Poor sleep elevates nocturnal cortisol, which degrades skin barrier integrity and amplifies inflammatory redness.
- **Zinc & Omega-3**: Anti-inflammatory compounds that calm cystic acne.
    `
  }
];
