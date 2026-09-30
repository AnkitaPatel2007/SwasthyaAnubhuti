import { DiseaseCondition } from '../types/index.ts';

export const DISEASES_CATALOG: DiseaseCondition[] = [
  {
    id: 'anemia-iron-deficiency',
    name: 'Iron Deficiency & Anemia',
    category: 'Nutritional & Blood',
    prevalenceInYouth: 'Affects over 30% of young women and 10% of young men (common in college students and plant-based diets).',
    description: 'A condition where blood lacks adequate healthy red blood cells or iron stores, significantly reducing oxygen delivery to the brain and working muscles.',
    commonSymptoms: [
      'Persistent fatigue and midday exhaustion',
      'Brain fog and difficulty concentrating during lectures/work',
      'Dizziness or lightheadedness when standing up quickly',
      'Pale skin, brittle spoon-shaped nails, cold hands/feet',
      'Shortness of breath during moderate stairs or exercise'
    ],
    keyLabTests: [
      { testName: 'Complete Blood Count (CBC)', keyParameter: 'Hemoglobin (Hb)', typicalAbnormality: '< 12.0 g/dL (Females), < 13.5 g/dL (Males)' },
      { testName: 'Iron Profile', keyParameter: 'Serum Ferritin', typicalAbnormality: '< 20 - 30 ng/mL (depleted iron reserves)' },
      { testName: 'RBC Indices', keyParameter: 'MCV (Mean Corpuscular Volume)', typicalAbnormality: '< 80 fL (microcytic cells)' }
    ],
    riskFactors: [
      'Low dietary intake of bioavailable heme iron (strict vegan/vegetarian diets without fortification)',
      'Heavy menstrual cycles',
      'Intense endurance running or athletic training',
      'Drinking tea or coffee immediately with meals (tannins block iron absorption)'
    ],
    preventionLifestyle: [
      'Combine iron-rich legumes, spinach, and tofu with Vitamin C (lemon, citrus, bell peppers) to boost absorption by up to 300%.',
      'Avoid drinking tea, coffee, or calcium supplements within 1 hour of iron-rich meals.',
      'Take doctor-recommended gentle iron supplements with food to prevent GI upset.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Chest pain or rapid pounding heart rate (palpitations) at rest',
      'Unexplained fainting (syncope) or severe dizziness',
      'Extreme shortness of breath during routine walking'
    ]
  },
  {
    id: 'vitamin-d-b12-deficiency',
    name: 'Vitamin D & B12 Deficiencies',
    category: 'Nutritional & Blood',
    prevalenceInYouth: 'Over 65% of students and indoor desk workers have insufficient Vitamin D (< 30 ng/mL). B12 is prevalent in vegetarian diets.',
    description: 'Essential micronutrient deficits caused by excessive indoor screen time, lack of direct sunlight, and restrictive student diets.',
    commonSymptoms: [
      'Low morning energy and seasonal mood dips',
      'Diffuse muscle aches, bone tenderness, and frequent colds',
      'Numbness or "pins and needles" tingling in fingers and toes (B12)',
      'Impaired memory recall, forgetfulness, and sluggish mental processing'
    ],
    keyLabTests: [
      { testName: 'Vitamin D 25-Hydroxy', keyParameter: '25-OH Vitamin D', typicalAbnormality: '< 30.0 ng/mL (Deficient if < 20 ng/mL)' },
      { testName: 'Serum Cobalamin', keyParameter: 'Vitamin B12', typicalAbnormality: '< 200 - 300 pg/mL' }
    ],
    riskFactors: [
      'Working or studying indoors 8+ hours a day with minimal sun exposure',
      'Regular sunscreen use preventing cutaneous UV synthesis',
      'Strict plant-based diets without active B12 cyanocobalamin supplementation',
      'Frequent usage of antacids or PPIs that reduce stomach acid needed to absorb B12'
    ],
    preventionLifestyle: [
      'Get 15–20 minutes of midday sunlight on arms and face when the UV index is > 3.',
      'Incorporate fortified milks, eggs, wild salmon, or daily 1,000–2,000 IU Vitamin D3 supplements.',
      'Take a weekly sublingual methylcobalamin or daily multivitamin if following a vegetarian diet.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Persistent numbness, unsteadiness while walking, or tingling in extremities',
      'Severe depressive mood or cognitive decline that interferes with academics/work'
    ]
  },
  {
    id: 'prediabetes-insulin-resistance',
    name: 'Pre-Diabetes & Insulin Resistance',
    category: 'Metabolic & Cardiovascular',
    prevalenceInYouth: 'Rising rapidly among young adults ages 18–35 due to sedentary lifestyles, energy drinks, and ultra-processed food.',
    description: 'A metabolic state where cells become resistant to insulin, forcing the pancreas to produce excess insulin to keep blood sugar normal, eventually leading to Type 2 Diabetes.',
    commonSymptoms: [
      'Post-meal energy crashes ("food coma") especially after carb-heavy lunches',
      'Intense cravings for sugar or caffeine 1–2 hours after eating',
      'Darkened, velvety skin patches on the neck folds or armpits (Acanthosis Nigricans)',
      'Unexplained weight gain primarily around the lower abdominal area',
      'Frequent urination and excessive thirst'
    ],
    keyLabTests: [
      { testName: 'Fasting Blood Sugar (FBS)', keyParameter: 'Glucose (Fasting)', typicalAbnormality: '100 - 125 mg/dL (Pre-diabetes); >= 126 mg/dL (Diabetes)' },
      { testName: 'Glycated Hemoglobin', keyParameter: 'HbA1c', typicalAbnormality: '5.7% - 6.4% (Pre-diabetes); >= 6.5% (Diabetes)' },
      { testName: 'Metabolic Ratio', keyParameter: 'Triglyceride-to-HDL Ratio', typicalAbnormality: '> 3.0 (surrogate marker for insulin resistance)' }
    ],
    riskFactors: [
      'Family history of Type 2 Diabetes in parents or siblings',
      'High consumption of sugary sodas, energy drinks, and refined grains',
      'Sedentary lifestyle (< 3,000 steps/day)',
      'Chronic sleep deprivation (< 6 hours/night reduces insulin sensitivity by 30%)'
    ],
    preventionLifestyle: [
      'Eat food in the right order: fiber/greens and protein first, starches and sugars last.',
      'Take a brisk 10-minute walk after lunch and dinner to activate muscle GLUT4 glucose uptake.',
      'Aim for 150 minutes of weekly moderate aerobic activity or 2 strength-training sessions.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Rapid unintended weight loss accompanied by excessive thirst and urination',
      'Fasting glucose readings consistently above 115 mg/dL on repeated tests'
    ]
  },
  {
    id: 'dyslipidemia-high-cholesterol',
    name: 'Dyslipidemia (High Cholesterol & Triglycerides)',
    category: 'Metabolic & Cardiovascular',
    prevalenceInYouth: '1 in 5 young adults (ages 20–39) has elevated total cholesterol or high triglycerides.',
    description: 'An imbalance of blood lipids (elevated LDL cholesterol, high triglycerides, or low protective HDL) that initiates early arterial plaque accumulation.',
    commonSymptoms: [
      'Often "silent" with zero early symptoms until blood tests are performed',
      'Occasionally sluggish circulation or fatigue when paired with metabolic syndrome',
      'May co-exist with mild fatty liver or abdominal obesity'
    ],
    keyLabTests: [
      { testName: 'Lipid Panel', keyParameter: 'LDL-C (Low-Density Lipoprotein)', typicalAbnormality: '> 100 mg/dL (optimal is < 100 mg/dL; high is > 130 mg/dL)' },
      { testName: 'Lipid Panel', keyParameter: 'Triglycerides', typicalAbnormality: '> 150 mg/dL (frequently driven by sugar and alcohol)' },
      { testName: 'Lipid Panel', keyParameter: 'HDL-C (High-Density Lipoprotein)', typicalAbnormality: '< 40 mg/dL (Males) or < 50 mg/dL (Females) is low' }
    ],
    riskFactors: [
      'Frequent reliance on deep-fried takeout, processed baked goods, and palm/trans fats',
      'Genetics (Familial Hypercholesterolemia where LDL is high despite clean diet)',
      'Heavy binge drinking and high-fructose corn syrup beverages',
      'Vaping, smoking, and lack of cardiovascular exercise'
    ],
    preventionLifestyle: [
      'Increase soluble fiber (oats, chia seeds, lentils, apples) which binds bile acids in the gut.',
      'Replace butter and hydrogenated oils with extra-virgin olive oil, nuts, and avocados.',
      'Perform regular zone-2 cardiovascular exercise (jogging, cycling, swimming).'
    ],
    warningSignsWhenToSeeDoctor: [
      'Family history of premature heart attack before age 50 in parents or grandparents',
      'LDL cholesterol exceeding 160–190 mg/dL requires immediate physician evaluation'
    ]
  },
  {
    id: 'hypertension-high-blood-pressure',
    name: 'Early Hypertension (High Blood Pressure)',
    category: 'Metabolic & Cardiovascular',
    prevalenceInYouth: 'Affects roughly 12–15% of college students and young professionals, often undetected.',
    description: 'Chronic elevated pressure of circulating blood against arterial walls, frequently exacerbated in youth by exam/work stress, caffeine overconsumption, and high-sodium packaged snacks.',
    commonSymptoms: [
      'Usually silent; known as the "silent condition"',
      'Occipital morning headaches at the back of the skull',
      'Pounding sensation in the ears or neck after heavy caffeine',
      'Nosebleeds or facial flushing during high-stress periods'
    ],
    keyLabTests: [
      { testName: 'Blood Pressure Monitor', keyParameter: 'Systolic / Diastolic Pressure', typicalAbnormality: '>= 120/80 mmHg (Elevated); >= 130/80 mmHg (Stage 1 Hypertension)' },
      { testName: 'Kidney Function Test', keyParameter: 'Serum Creatinine & eGFR', typicalAbnormality: 'Monitored to ensure kidneys are not stressed by blood pressure' }
    ],
    riskFactors: [
      'Excessive sodium intake from instant noodles, chips, processed meats, and takeout',
      'Energy drink and pre-workout supplement overconsumption (> 400mg caffeine/day)',
      'Chronic unmanaged anxiety, academic deadlines, and lack of restorative sleep',
      'Overweight BMI and family history of high blood pressure'
    ],
    preventionLifestyle: [
      'Follow the DASH eating plan: abundant potassium from bananas, spinach, sweet potatoes, and yogurt.',
      'Limit sodium to < 2,300 mg/day (read nutrition labels on packaged student foods).',
      'Practice 5 minutes of box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) to downregulate sympathetic tone.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Blood pressure readings exceeding 140/90 mmHg on three separate occasions',
      'Severe sudden headache with blurred vision, chest tightness, or shortness of breath (Hypertensive Crisis)'
    ]
  },
  {
    id: 'thyroid-disorders-hypo-hyper',
    name: 'Thyroid Disorders (Hypothyroidism & Hyperthyroidism)',
    category: 'Endocrine & Hormones',
    prevalenceInYouth: 'Subclinical hypothyroidism is present in ~5–8% of young adults, disproportionately affecting young women.',
    description: 'Dysfunction of the butterfly-shaped thyroid gland that regulates the body’s metabolic rate, temperature control, and protein synthesis.',
    commonSymptoms: [
      'Hypothyroid: Unexplained weight gain despite diet, intolerance to cold weather, chronic sluggishness, dry skin, constipation',
      'Hyperthyroid: Unintentional rapid weight loss, heat intolerance, racing heart rate, hand tremors, jittery anxiety',
      'Irregular menstrual cycles or delayed cycles',
      'Thinning hair or loss of outer third of eyebrows'
    ],
    keyLabTests: [
      { testName: 'Thyroid Panel', keyParameter: 'TSH (Thyroid Stimulating Hormone)', typicalAbnormality: '> 4.5 uIU/mL (Hypo) or < 0.4 uIU/mL (Hyper)' },
      { testName: 'Thyroid Panel', keyParameter: 'Free T4 & Free T3', typicalAbnormality: 'Below normal range in overt hypothyroidism' },
      { testName: 'Antibody Screen', keyParameter: 'Anti-TPO Antibodies', typicalAbnormality: 'Positive in Hashimoto Thyroiditis autoimmune conditions' }
    ],
    riskFactors: [
      'Family history of thyroid disease or autoimmune disorders (celiac, vitiligo, Type 1 diabetes)',
      'Severe prolonged emotional or physiological stress',
      'Iodine or selenium deficiencies, or extreme crash dieting'
    ],
    preventionLifestyle: [
      'Use iodized table salt and include dietary selenium (1–2 Brazil nuts daily).',
      'Avoid unmonitored extreme low-calorie crash diets that downregulate thyroid conversion.',
      'Maintain regular sleep schedules to protect hypothalamic-pituitary-thyroid axis.'
    ],
    warningSignsWhenToSeeDoctor: [
      'TSH reading above 5.0 uIU/mL on routine blood test',
      'Visible swelling at the base of the front of the neck (Goiter) or difficulty swallowing'
    ]
  },
  {
    id: 'fatty-liver-nafld',
    name: 'Non-Alcoholic Fatty Liver (NAFLD / MAFLD)',
    category: 'Digestive & Gut',
    prevalenceInYouth: 'Surging in young adults (estimated 20% in young urban populations) linked to sugary drinks and sedentary screen time.',
    description: 'Accumulation of excessive triglycerides inside liver hepatocytes in individuals who drink little to no alcohol, leading to cellular inflammation.',
    commonSymptoms: [
      'Often completely asymptomatic in early stages',
      'Dull ache or fullness in the upper right side of the abdomen below ribs',
      'Unexplained generalized chronic fatigue and low daytime stamina'
    ],
    keyLabTests: [
      { testName: 'Liver Function Test (LFT)', keyParameter: 'ALT (Alanine Aminotransferase)', typicalAbnormality: '> 35 U/L (indicates hepatocellular inflammation)' },
      { testName: 'Liver Function Test (LFT)', keyParameter: 'AST (Aspartate Aminotransferase)', typicalAbnormality: 'Elevated alongside ALT' },
      { testName: 'Imaging', keyParameter: 'Abdominal Ultrasound', typicalAbnormality: 'Increased echogenicity showing hepatic steatosis' }
    ],
    riskFactors: [
      'High intake of liquid high-fructose corn syrup (sodas, boba, sweetened iced teas)',
      'Late-night heavy fast food snacking followed immediately by sleeping',
      'Visceral abdominal adiposity and insulin resistance'
    ],
    preventionLifestyle: [
      'Completely eliminate sugary beverages; replace with water, sparkling water, or unsweetened green tea.',
      'Weight loss of just 5–7% can reverse early hepatic fat accumulation completely.',
      'Eat cruciferous vegetables (broccoli, cabbage, arugula) that support liver glutathione production.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Liver enzyme ALT or AST over 2x upper limit of normal',
      'Yellowing of skin or whites of eyes (Jaundice), dark tea-colored urine'
    ]
  },
  {
    id: 'gerd-acid-reflux-ibs',
    name: 'GERD (Acid Reflux) & Irritable Bowel Syndrome',
    category: 'Digestive & Gut',
    prevalenceInYouth: 'Very common in college students (up to 25%) driven by late-night studying, coffee on an empty stomach, and exam anxiety.',
    description: 'Upper digestive tract acid reflux and gut-brain axis motility disturbances leading to chronic abdominal discomfort, bloating, and heartburn.',
    commonSymptoms: [
      'Burning sensation in chest or throat (heartburn) after spicy, fatty, or late meals',
      'Sour liquid regurgitation and chronic dry morning throat clearing',
      'Alternating constipation and loose stools triggered by stress',
      'Painful abdominal gas and bloating that worsens toward the evening'
    ],
    keyLabTests: [
      { testName: 'Stool Test & CBC', keyParameter: 'Fecal Calprotectin & Hemoglobin', typicalAbnormality: 'Normal in IBS (used to rule out Inflammatory Bowel Disease / Crohn’s)' },
      { testName: 'Celiac Panel', keyParameter: 'tTG-IgA Antibody', typicalAbnormality: 'Tested to rule out gluten celiac disease' }
    ],
    riskFactors: [
      'Eating heavy meals within 2 hours of lying down to sleep',
      'Drinking strong black coffee or energy drinks on an empty stomach first thing in the morning',
      'High psychological stress affecting vagus nerve gut motility',
      'Over-reliance on NSAID painkillers (ibuprofen, naproxen) which damage the stomach lining'
    ],
    preventionLifestyle: [
      'Never lie down for at least 2.5 to 3 hours after eating dinner.',
      'Have coffee only after eating a breakfast containing protein or healthy fats.',
      'Elevate the head of your bed slightly if night reflux occurs.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Difficulty or pain when swallowing food (Dysphagia)',
      'Vomiting blood or black tarry stools (signs of gastrointestinal bleeding)',
      'Unexplained significant weight loss alongside chronic diarrhea'
    ]
  },
  {
    id: 'migraines-tension-headaches',
    name: 'Migraines & Tension Headaches',
    category: 'Mental & Neurological',
    prevalenceInYouth: 'Primary cause of missed college classes and workplace absenteeism in young adults ages 18–35.',
    description: 'Neurological headache disorders characterized by throbbing pain, sensory hypersensitivity, and pericranial muscle contractions from posture and stress.',
    commonSymptoms: [
      'Intense pulsating or throbbing pain, often on one side of the head',
      'Sensitivity to bright light (photophobia), loud sounds, or screen glare',
      'Nausea or upset stomach during headache episodes',
      'Visual aura (flashing lights, zigzag patterns) 20 minutes before headache onset',
      'Tight band-like pressure around the forehead and base of skull (Tension type)'
    ],
    keyLabTests: [
      { testName: 'Clinical Neurological Evaluation', keyParameter: 'Blood Pressure & Vitals', typicalAbnormality: 'Tested to rule out secondary hypertension' },
      { testName: 'Blood Work', keyParameter: 'CBC & Serum Electrolytes', typicalAbnormality: 'Monitors severe dehydration, anemia, or systemic infection' }
    ],
    riskFactors: [
      'Staring at high-brightness laptop/phone screens for 6+ hours without breaks',
      'Forward head desk posture ("text neck") straining suboccipital cervical muscles',
      'Skipping meals leading to reactive hypoglycemia triggers',
      'Sudden caffeine withdrawal on weekends after high weekday consumption'
    ],
    preventionLifestyle: [
      'Adhere strictly to the 20-20-20 rule: every 20 minutes look 20 feet away for 20 seconds.',
      'Keep a consistent daily sleep schedule—avoiding both sleep deprivation and massive weekend oversleeping.',
      'Ensure 2.5 liters of daily hydration and supplement with 200–400 mg Magnesium glycinate if approved by doctor.'
    ],
    warningSignsWhenToSeeDoctor: [
      '"Thunderclap" sudden onset severe headache that peaks within 60 seconds (requires ER emergency evaluation)',
      'Headache accompanied by fever, stiff neck, confusion, seizure, or focal weakness'
    ]
  },
  {
    id: 'academic-burnout-anxiety',
    name: 'Chronic Academic Burnout & Anxiety',
    category: 'Mental & Neurological',
    prevalenceInYouth: 'Over 44% of college students report chronic overwhelming stress and symptoms of clinical anxiety.',
    description: 'A state of emotional, physical, and mental exhaustion caused by prolonged and chronic academic, career, and social media pressures, driving autonomic nervous system imbalance.',
    commonSymptoms: [
      'Constant dread, racing thoughts, and inability to unwind or quiet the mind',
      'Feeling physically drained despite spending 8 hours in bed',
      'Cynicism, detachment, and loss of enjoyment in studies, hobbies, and social life',
      'Somatic manifestations: muscle tightness in shoulders/jaw, teeth grinding, shallow breathing',
      'Unpredictable irritability and emotional sensitivity'
    ],
    keyLabTests: [
      { testName: 'Endocrine & Metabolic Screen', keyParameter: 'TSH, Vitamin D, Ferritin, Cortisol', typicalAbnormality: 'Monitored to ensure biological deficiencies are not mimicking depression/burnout' }
    ],
    riskFactors: [
      'Perfectionism and lack of clear boundaries between work/study and personal rest',
      'Chronic screen addiction, doom-scrolling, and late-night social media comparison',
      'Lack of supportive social connections and physical community'
    ],
    preventionLifestyle: [
      'Enforce a strict digital sunset 1 hour before bed (no social media or work emails).',
      'Schedule non-negotiable daily restorative periods: 20 minutes of outdoor nature walking without headphones.',
      'Break overwhelming study tasks into 25-minute Pomodoro intervals to prevent cognitive fatigue.'
    ],
    warningSignsWhenToSeeDoctor: [
      'Persistent feelings of hopelessness, severe panic attacks, or inability to perform basic daily activities',
      'Any thoughts of self-harm or suicide (Immediately call or text 988 Crisis Lifeline)'
    ]
  }
];
