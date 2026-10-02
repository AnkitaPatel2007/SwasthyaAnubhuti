import { DailyHealthUpdate, UserProfile, HealthAnomalyInsight } from '../types/index.ts';

export function analyzeHealthAnomalies(
  updates: DailyHealthUpdate[] = [],
  profile: UserProfile | null = null
): HealthAnomalyInsight[] {
  const insights: HealthAnomalyInsight[] = [];
  if (!updates || updates.length === 0) return insights;

  // Sort updates by date ascending
  const sorted = [...updates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];
  const previousDays = sorted.slice(0, sorted.length - 1);

  // Baselines
  const baselineSleep = profile?.targetSleepHours || 8.0;
  const baselineHr = profile?.restingHeartRate || 71;
  const baselineSystolic = profile?.bloodPressureSystolic || 118;
  const baselineDiastolic = profile?.bloodPressureDiastolic || 76;
  const targetWaterGlasses = Math.round((profile?.targetWaterMl || 2500) / 250);

  // 1. Sleep Drop Anomaly Detection
  if (latest.sleepHours !== undefined && latest.sleepHours > 0) {
    const recentSleepAvg = previousDays.length > 0
      ? previousDays.slice(-5).reduce((acc, u) => acc + (u.sleepHours || baselineSleep), 0) / Math.min(5, previousDays.length)
      : baselineSleep;

    const sleepDeficit = recentSleepAvg - latest.sleepHours;
    if (sleepDeficit >= 2.0 || latest.sleepHours <= 5.5) {
      insights.push({
        id: `insight_sleep_${latest.date}`,
        type: 'sleep_drop',
        severity: latest.sleepHours < 5.0 ? 'urgent' : 'warning',
        title: 'Unusual Sleep Drop Detected',
        message: `Your sleep dropped to ${latest.sleepHours}h last night (${sleepDeficit.toFixed(1)}h lower than your recent ${recentSleepAvg.toFixed(1)}h average).`,
        metricLabel: 'Night Rest',
        metricCurrent: `${latest.sleepHours} hrs`,
        metricBaseline: `${recentSleepAvg.toFixed(1)} hrs`,
        detectedAt: latest.date,
        clinicalAction: 'Prioritize a 20-minute power rest before 3 PM, avoid caffeine after 2 PM, and set an alarm for a 10:30 PM wind-down.'
      });
    }
  }

  // 2. Resting Heart Rate Spike Anomaly
  if (latest.restingHeartRate !== undefined && latest.restingHeartRate > 0) {
    const hrDelta = latest.restingHeartRate - baselineHr;
    if (hrDelta >= 10 || latest.restingHeartRate >= 85) {
      insights.push({
        id: `insight_hr_${latest.date}`,
        type: 'heart_rate_spike',
        severity: latest.restingHeartRate >= 90 ? 'urgent' : 'warning',
        title: 'Resting Heart Rate Spike',
        message: `Resting pulse logged at ${latest.restingHeartRate} bpm (+${hrDelta} bpm above your ${baselineHr} bpm baseline).`,
        metricLabel: 'Resting Pulse',
        metricCurrent: `${latest.restingHeartRate} bpm`,
        metricBaseline: `${baselineHr} bpm`,
        detectedAt: latest.date,
        clinicalAction: 'Hydrate with 500ml water and electrolytes. Elevated resting pulse in young adults is often driven by dehydration, high cortisol, or fever.'
      });
    }
  }

  // 3. Blood Pressure Elevation Anomaly
  if (latest.bloodPressure) {
    const parts = latest.bloodPressure.split('/');
    if (parts.length === 2) {
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (sys >= 130 || dia >= 85) {
        insights.push({
          id: `insight_bp_${latest.date}`,
          type: 'blood_pressure_spike',
          severity: sys >= 138 || dia >= 90 ? 'urgent' : 'warning',
          title: 'Elevated Blood Pressure Alert',
          message: `Logged blood pressure ${sys}/${dia} mmHg is elevated compared to your target ${baselineSystolic}/${baselineDiastolic} mmHg.`,
          metricLabel: 'Blood Pressure',
          metricCurrent: `${sys}/${dia} mmHg`,
          metricBaseline: `${baselineSystolic}/${baselineDiastolic} mmHg`,
          detectedAt: latest.date,
          clinicalAction: 'Avoid high-sodium snacks or energy drinks today. Perform 5 minutes of slow diaphragmatic breathing and log another reading this evening.'
        });
      }
    }
  }

  // 4. Hydration Deficit Anomaly
  if (latest.waterGlasses !== undefined && latest.waterGlasses < targetWaterGlasses * 0.5) {
    insights.push({
      id: `insight_water_${latest.date}`,
      type: 'hydration_deficit',
      severity: 'warning',
      title: 'Severe Hydration Deficit',
      message: `You have only logged ${latest.waterGlasses} glasses today (${targetWaterGlasses - latest.waterGlasses} glasses short of your ${targetWaterGlasses}-glass goal).`,
      metricLabel: 'Hydration',
      metricCurrent: `${latest.waterGlasses} glasses`,
      metricBaseline: `${targetWaterGlasses} glasses`,
      detectedAt: latest.date,
      clinicalAction: 'Drink 2 full glasses of water right now to prevent tension headaches, dry eyes, and study fatigue.'
    });
  }

  // 5. Stress Surge Anomaly
  if (latest.stressLevel >= 4 && latest.energyLevel <= 2) {
    insights.push({
      id: `insight_stress_${latest.date}`,
      type: 'stress_surge',
      severity: 'warning',
      title: 'High Stress & Energy Depletion Surge',
      message: `Logged stress is high (${latest.stressLevel}/5) with low vitality (${latest.energyLevel}/5).`,
      metricLabel: 'Burnout Index',
      metricCurrent: 'Elevated Stress',
      metricBaseline: 'Balanced',
      detectedAt: latest.date,
      clinicalAction: 'Take a 10-minute break from screen work. Step outside for fresh air and natural sunlight.'
    });
  }

  return insights;
}
