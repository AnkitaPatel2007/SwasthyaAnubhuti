import { DailyHealthUpdate, UserProfile, TrendDeclineAlert, TrendActionTip } from '../types/index.ts';

// Evaluates the user's daily updates over a 7-day window
export function detectBiomarkerDeclines(
  updates: DailyHealthUpdate[],
  profile: UserProfile | null
): TrendDeclineAlert[] {
  if (!updates || updates.length < 3) {
    return getSimulatedDeclineAlerts();
  }

  const sorted = [...updates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recent7 = sorted.slice(-7);

  const alerts: TrendDeclineAlert[] = [];

  // 1. SLEEP ANALYSIS
  const sleepPoints = recent7.map(u => ({
    date: u.date,
    day: getShortDay(u.date),
    value: u.sleepHours ?? 7.0
  }));

  if (sleepPoints.length >= 3) {
    const sleepCheck = checkConsecutiveOrSignificantDrop(sleepPoints.map(p => p.value));
    const firstSleep = sleepPoints[0].value;
    const lastSleep = sleepPoints[sleepPoints.length - 1].value;
    const netDrop = firstSleep - lastSleep;

    if (sleepCheck.hasDecline || netDrop >= 1.5) {
      alerts.push({
        id: 'alert_sleep_decline',
        biomarker: 'sleep',
        title: 'Sleep is dropping',
        severity: lastSleep < 6.0 || netDrop >= 2.0 ? 'critical' : 'warning',
        consecutiveDeclineDays: sleepCheck.consecutiveDays || Math.min(7, sleepPoints.length),
        baselineValue: Number(firstSleep.toFixed(1)),
        currentValue: Number(lastSleep.toFixed(1)),
        unit: 'hrs',
        deltaText: `-${netDrop.toFixed(1)} hrs`,
        summary: `Your sleep dropped from ${firstSleep.toFixed(1)}h down to ${lastSleep.toFixed(1)}h this week.`,
        impactExplanation: 'Less sleep leads to brain fog, low focus, and fatigue.',
        dataPoints: sleepPoints,
        actionableTips: [
          {
            title: 'Wake up at the same time',
            description: 'Wake up at the same hour daily to reset your body clock.',
            category: 'routine'
          },
          {
            title: '10 mins of morning sunlight',
            description: 'Get outside in the morning light to feel awake and sleep better at night.',
            category: 'quick_fix'
          },
          {
            title: 'Put away screens 45 mins before bed',
            description: 'Turn off your phone and laptop screen to help your brain rest.',
            category: 'routine',
            actionLabel: 'Set 10:30 PM Reminder',
            actionType: 'set_reminder'
          },
          {
            title: 'No coffee after 2:00 PM',
            description: 'Caffeine stays in your body for 6+ hours and prevents deep sleep.',
            category: 'nutrition'
          }
        ]
      });
    }
  }

  // 2. WATER INTAKE ANALYSIS
  const waterPoints = recent7.map(u => ({
    date: u.date,
    day: getShortDay(u.date),
    value: u.waterGlasses ?? 6
  }));

  if (waterPoints.length >= 3) {
    const waterCheck = checkConsecutiveOrSignificantDrop(waterPoints.map(p => p.value));
    const firstWater = waterPoints[0].value;
    const lastWater = waterPoints[waterPoints.length - 1].value;
    const netDrop = firstWater - lastWater;

    if (waterCheck.hasDecline || netDrop >= 2.5) {
      alerts.push({
        id: 'alert_water_decline',
        biomarker: 'water',
        title: 'Water intake is dropping',
        severity: lastWater <= 4 ? 'critical' : 'warning',
        consecutiveDeclineDays: waterCheck.consecutiveDays || Math.min(6, waterPoints.length),
        baselineValue: firstWater,
        currentValue: lastWater,
        unit: 'glasses',
        deltaText: `-${netDrop} glasses`,
        summary: `Water dropped from ${firstWater} glasses down to ${lastWater} glasses today.`,
        impactExplanation: 'Low water intake causes headaches, tiredness, and dry eyes.',
        dataPoints: waterPoints,
        actionableTips: [
          {
            title: 'Drink 2 glasses upon waking',
            description: 'Drink water first thing in the morning before tea or coffee.',
            category: 'quick_fix',
            actionLabel: 'Drink 1 Glass Now (+250ml)',
            actionType: 'add_water'
          },
          {
            title: 'Keep a water bottle on your desk',
            description: 'Keeping water in sight reminds you to drink throughout the day.',
            category: 'routine'
          },
          {
            title: 'Add a slice of lemon',
            description: 'A little lemon or mint makes drinking water easier and refreshing.',
            category: 'nutrition'
          }
        ]
      });
    }
  }

  // 3. ENERGY SLUMP
  const energyPoints = recent7.map(u => ({
    date: u.date,
    day: getShortDay(u.date),
    value: u.energyLevel ?? 4
  }));

  if (energyPoints.length >= 3) {
    const energyCheck = checkConsecutiveOrSignificantDrop(energyPoints.map(p => p.value));
    const firstEnergy = energyPoints[0].value;
    const lastEnergy = energyPoints[energyPoints.length - 1].value;
    const netDrop = firstEnergy - lastEnergy;

    if ((energyCheck.hasDecline && netDrop >= 1.5) || lastEnergy <= 2) {
      alerts.push({
        id: 'alert_energy_decline',
        biomarker: 'energy',
        title: 'Energy is low',
        severity: 'warning',
        consecutiveDeclineDays: energyCheck.consecutiveDays || 4,
        baselineValue: firstEnergy,
        currentValue: lastEnergy,
        unit: '/ 5',
        deltaText: `-${netDrop} pts`,
        summary: `Your energy dropped from ${firstEnergy}/5 down to ${lastEnergy}/5.`,
        impactExplanation: 'Low energy is usually tied to less sleep and not enough water.',
        dataPoints: energyPoints,
        actionableTips: [
          {
            title: 'Take a short 10-minute walk',
            description: 'Walking outdoors pumps fresh oxygen to your brain and body.',
            category: 'quick_fix'
          },
          {
            title: 'Check your iron & vitamins',
            description: 'Low iron or low Vitamin D can make you feel tired every day.',
            category: 'doctor',
            actionLabel: 'Ask AI Doctor Advice',
            actionType: 'ask_ai'
          }
        ]
      });
    }
  }

  return alerts;
}

function checkConsecutiveOrSignificantDrop(values: number[]): { hasDecline: boolean; consecutiveDays: number } {
  if (values.length < 3) return { hasDecline: false, consecutiveDays: 0 };

  let dropCount = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) {
      dropCount++;
    }
  }

  const netDrop = values[0] - values[values.length - 1];
  const percentDrop = values[0] > 0 ? (netDrop / values[0]) * 100 : 0;
  const hasDecline = (dropCount >= values.length - 2 && netDrop > 0) || percentDrop >= 20;

  return {
    hasDecline,
    consecutiveDays: dropCount + 1,
  };
}

function getShortDay(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return dateStr;
  }
}

export function getSimulatedDeclineAlerts(): TrendDeclineAlert[] {
  return [
    {
      id: 'alert_sleep_7day_decline',
      biomarker: 'sleep',
      title: 'Sleep is dropping',
      severity: 'critical',
      consecutiveDeclineDays: 6,
      baselineValue: 8.2,
      currentValue: 5.4,
      unit: 'hrs',
      deltaText: '-2.8 hrs',
      summary: 'Your sleep dropped from 8.2h down to 5.4h over the past 6 days.',
      impactExplanation: 'Less sleep leads to brain fog, low focus, and fatigue.',
      dataPoints: [
        { date: '2026-09-23', day: 'Wed', value: 8.2 },
        { date: '2026-09-24', day: 'Thu', value: 7.9 },
        { date: '2026-09-25', day: 'Fri', value: 7.3 },
        { date: '2026-09-26', day: 'Sat', value: 6.8 },
        { date: '2026-09-27', day: 'Sun', value: 6.2 },
        { date: '2026-09-28', day: 'Mon', value: 5.8 },
        { date: '2026-09-29', day: 'Tue', value: 5.4 },
      ],
      actionableTips: [
        {
          title: 'Wake up at the same time',
          description: 'Wake up at the same hour daily to reset your body clock.',
          category: 'routine'
        },
        {
          title: '10 mins of morning sun',
          description: 'Outdoor light helps you feel awake and sleep better at night.',
          category: 'quick_fix'
        },
        {
          title: 'Put away screens 45 mins before bed',
          description: 'Turn off your phone to help your brain rest.',
          category: 'routine',
          actionLabel: 'Set 10:30 PM Reminder',
          actionType: 'set_reminder'
        },
        {
          title: 'No coffee after 2:00 PM',
          description: 'Caffeine prevents deep sleep.',
          category: 'nutrition'
        }
      ]
    },
    {
      id: 'alert_water_7day_decline',
      biomarker: 'water',
      title: 'Water intake is dropping',
      severity: 'warning',
      consecutiveDeclineDays: 5,
      baselineValue: 9,
      currentValue: 4,
      unit: 'glasses',
      deltaText: '-5 glasses',
      summary: 'Water dropped from 9 glasses down to 4 glasses today.',
      impactExplanation: 'Low water intake causes headaches, tiredness, and dry eyes.',
      dataPoints: [
        { date: '2026-09-23', day: 'Wed', value: 9 },
        { date: '2026-09-24', day: 'Thu', value: 8 },
        { date: '2026-09-25', day: 'Fri', value: 7 },
        { date: '2026-09-26', day: 'Sat', value: 6 },
        { date: '2026-09-27', day: 'Sun', value: 5 },
        { date: '2026-09-28', day: 'Mon', value: 4 },
        { date: '2026-09-29', day: 'Tue', value: 4 },
      ],
      actionableTips: [
        {
          title: 'Drink 2 glasses upon waking',
          description: 'Drink water first thing in the morning before tea or coffee.',
          category: 'quick_fix',
          actionLabel: 'Drink 1 Glass Now (+250ml)',
          actionType: 'add_water'
        },
        {
          title: 'Keep a water bottle on your desk',
          description: 'Keeping water in sight reminds you to drink during the day.',
          category: 'routine'
        },
        {
          title: 'Add a slice of lemon',
          description: 'A little lemon or mint makes drinking water easier and refreshing.',
          category: 'nutrition'
        }
      ]
    }
  ];
}
