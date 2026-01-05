import { DayEntry } from './storage';

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  points: number;
  check: (ctx: MissionContext) => boolean;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  points: number;
  check: (ctx: AchievementContext) => boolean;
}

export interface MissionContext {
  day: DayEntry;
  dayKey: string;
  lateCount: number;
  completedCount: number;
  allCompleted: boolean;
}

export interface AchievementContext extends MissionContext {
  totalCompletedDays: number;
  streak: number;
  perfectDays: number;
}

export const missionDefinitions: MissionDefinition[] = [
  {
    id: 'five-of-seven',
    title: 'Meet the standard',
    description: 'Complete at least 5 of 7 obligations.',
    points: 1,
    check: (ctx) => ctx.completedCount >= 5
  },
  {
    id: 'no-late-prayers',
    title: 'On time',
    description: 'Finish the day with zero late prayers.',
    points: 1,
    check: (ctx) => ctx.lateCount === 0 && ctx.completedCount >= 5
  },
  {
    id: 'perfect-day',
    title: 'Full balance',
    description: 'Complete all 7 obligations in one day.',
    points: 2,
    check: (ctx) => ctx.allCompleted
  }
];

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first-day',
    title: 'First step',
    description: 'Complete your first balanced day.',
    points: 2,
    check: (ctx) => ctx.totalCompletedDays >= 1
  },
  {
    id: 'streak-seven',
    title: 'Week strong',
    description: 'Reach a 7-day completion streak.',
    points: 5,
    check: (ctx) => ctx.streak >= 7
  },
  {
    id: 'perfect-three',
    title: 'Triple perfect',
    description: 'Log three perfect days (all 7 obligations).',
    points: 5,
    check: (ctx) => ctx.perfectDays >= 3
  }
];

export function evaluateMissions(
  ctx: MissionContext,
  progress: Record<string, { completed: boolean }>
): { earned: { id: string; points: number; title: string }[]; updated: Record<string, { completed: boolean }> } {
  const updated = { ...progress };
  const earned: { id: string; points: number; title: string }[] = [];

  missionDefinitions.forEach((mission) => {
    if (updated[mission.id]?.completed) return;
    if (mission.check(ctx)) {
      updated[mission.id] = { completed: true };
      earned.push({ id: mission.id, points: mission.points, title: mission.title });
    }
  });

  return { earned, updated };
}

export function evaluateAchievements(
  ctx: AchievementContext,
  progress: Record<string, { completed: boolean }>
): { earned: { id: string; points: number; title: string }[]; updated: Record<string, { completed: boolean }> } {
  const updated = { ...progress };
  const earned: { id: string; points: number; title: string }[] = [];

  achievementDefinitions.forEach((ach) => {
    if (updated[ach.id]?.completed) return;
    if (ach.check(ctx)) {
      updated[ach.id] = { completed: true };
      earned.push({ id: ach.id, points: ach.points, title: ach.title });
    }
  });

  return { earned, updated };
}

export function listMissions(progress: Record<string, { completed: boolean }>) {
  return missionDefinitions.map((m) => ({
    ...m,
    points: m.points,
    completed: progress[m.id]?.completed ?? false
  }));
}

export function listAchievements(progress: Record<string, { completed: boolean }>) {
  return achievementDefinitions.map((a) => ({
    ...a,
    completed: progress[a.id]?.completed ?? false
  }));
}
