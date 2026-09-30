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
      'If menstruating heavily or training intensely, discuss ferritin & iron stores with your clinician.'
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
    youthRelevance: 'Subclinical hypothyroidism is common in young adults, causing cold sensitivity, unprovoked weight gain, irregular sleepiness, and morning sluggishness.',
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
    youthRelevance: 'Helps detect early insulin resistance often paired with irregular sleep schedules, sweet cravings, and energy crashes after high-carb meals.',
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
