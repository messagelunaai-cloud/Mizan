import { useEffect, useMemo, useState } from 'react';
import {
  readCheckins,
  writeCheckins,
  getTodayKey,
  getPreviousDayKey,
  getEmptyDay,
  DayEntry,
  Penalty,
  CategoryStates,
  SalahPrayer,
  SalahStatus,
  QuranOption,
  PhysicalOption,
  BuildOption,
  isSalahComplete,
  salahLateCount,
  isQuranComplete,
  isPhysicalComplete,
  isBuildComplete,
  countCompletedCategories, // Import countCompletedCategories for completion counting
  calculateDailyPoints,
  computeStreak,
  updateLeaderboard,
  appendPointsLog,
  readUser,
  readMissionsProgress,
  writeMissionsProgress,
  readAchievementsProgress,
  writeAchievementsProgress
} from '@/utils/storage';
import {
  evaluateMissions,
  evaluateAchievements
} from '@/utils/gamification';

export interface CheckinState {
  dayKey: string;
  categories: CategoryStates;
  penalties: Penalty[];
  penaltiesResolved: boolean;
  canSubmit: boolean;
  submitted: boolean;
  completed: boolean;
  toggleSalahPrayer: (prayer: SalahPrayer, status: SalahStatus) => void;
  toggleQuranOption: (option: QuranOption) => void;
  setQuranDuration: (minutes: number) => void;
  togglePhysicalOption: (option: PhysicalOption) => void;
  setPhysicalDuration: (minutes: number) => void;
  toggleBuildOption: (option: BuildOption) => void;
  setBuildDescription: (text: string) => void;
  toggleOptionalTask: (task: 'study' | 'journal' | 'rest') => void;
  togglePenalty: (id: string) => void;
  submit: () => void;
  salahComplete: boolean;
  salahLateCount: number;
  quranComplete: boolean;
  physicalComplete: boolean;
  buildComplete: boolean;
  otherCategoriesCompleted: number;
}

export function useCheckin(): CheckinState {
  const [day, setDay] = useState<DayEntry>(getEmptyDay());
  const dayKey = useMemo(() => getTodayKey(), []);

  useEffect(() => {
    const all = readCheckins();
    const existing = all[dayKey];
    const base = existing
      ? { ...getEmptyDay(), ...existing, categories: { ...getEmptyDay().categories, ...existing.categories } }
      : getEmptyDay();

    const yesterdayKey = getPreviousDayKey();
    const yesterday = all[yesterdayKey];
    const missedYesterday = yesterday && (!yesterday.submitted || !yesterday.completed);

    let next = { ...base };
    if (missedYesterday) {
      const alreadyHasPenalty = next.penalties.some((p) => p.origin === yesterdayKey);
      if (!alreadyHasPenalty) {
        const penalty: Penalty = {
          id: `penalty-${yesterdayKey}`,
          label: 'Missed obligation — debt carried forward',
          origin: yesterdayKey,
          due: dayKey,
          type: 'extra-mile',
          resolved: false
        };
        next = { ...next, penalties: [...next.penalties, penalty] };
      }
    }

    setDay(next);
    all[dayKey] = next;
    writeCheckins(all);
  }, [dayKey]);

  const persist = (nextDay: DayEntry) => {
    const all = readCheckins();
    all[dayKey] = nextDay;
    writeCheckins(all);
  };

  const salahComplete = isSalahComplete(day.categories.salah);
  const salahLateCountValue = salahLateCount(day.categories.salah);
  const quranComplete = isQuranComplete(day.categories.quran);
  const physicalComplete = isPhysicalComplete(day.categories.physical);
  const buildComplete = isBuildComplete(day.categories.build);

  const otherCategoriesCompleted = useMemo(() => {
    let count = 0;
    if (quranComplete) count++;
    if (physicalComplete) count++;
    if (buildComplete) count++;
    if (day.categories.study.completed) count++;
    if (day.categories.journal.completed) count++;
    if (day.categories.rest.completed) count++;
    return count;
  }, [quranComplete, physicalComplete, buildComplete, day.categories]);

  const completedCount = countCompletedCategories(day.categories);
  // New completion rule: any 5 of 7 obligations
  const completed = completedCount >= 5;
  const penaltiesResolved = day.penalties.every((p) => p.resolved);
  const canSubmit = !day.submitted && completed && penaltiesResolved;

  const toggleSalahPrayer = (prayer: SalahPrayer, status: SalahStatus) => {
    if (day.submitted) return;
    setDay((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          salah: { ...prev.categories.salah, [prayer]: status }
        }
      };
      persist(next);
      return next;
    });
  };

  const toggleQuranOption = (option: QuranOption) => {
    if (day.submitted) return;
    setDay((prev) => {
      const current = prev.categories.quran.selected;
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          quran: {
            ...prev.categories.quran,
            selected: current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
          }
        }
      };
      persist(next);
      return next;
    });
  };

  const setQuranDuration = (minutes: number) => {
    if (day.submitted) return;
    setDay((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          quran: { ...prev.categories.quran, duration: minutes }
        }
      };
      persist(next);
      return next;
    });
  };

  const togglePhysicalOption = (option: PhysicalOption) => {
    if (day.submitted) return;
    setDay((prev) => {
      const current = prev.categories.physical.selected;
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          physical: {
            ...prev.categories.physical,
            selected: current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
          }
        }
      };
      persist(next);
      return next;
    });
  };

  const setPhysicalDuration = (minutes: number) => {
    if (day.submitted) return;
    setDay((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          physical: { ...prev.categories.physical, duration: minutes }
        }
      };
      persist(next);
      return next;
    });
  };

  const toggleBuildOption = (option: BuildOption) => {
    if (day.submitted) return;
    setDay((prev) => {
      const current = prev.categories.build.selected;
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          build: {
            ...prev.categories.build,
            selected: current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
          }
        }
      };
      persist(next);
      return next;
    });
  };

  const setBuildDescription = (text: string) => {
    if (day.submitted) return;
    setDay((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          build: { ...prev.categories.build, description: text }
        }
      };
      persist(next);
      return next;
    });
  };

  const toggleOptionalTask = (task: 'study' | 'journal' | 'rest') => {
    if (day.submitted) return;
    setDay((prev) => {
      const next = {
        ...prev,
        categories: {
          ...prev.categories,
          [task]: { ...prev.categories[task], completed: !prev.categories[task].completed }
        }
      };
      persist(next);
      return next;
    });
  };

  const togglePenalty = (id: string) => {
    if (day.submitted) return;
    setDay((prev) => {
      const nextPenalties = prev.penalties.map((p) => (p.id === id ? { ...p, resolved: !p.resolved } : p));
      const next = { ...prev, penalties: nextPenalties };
      persist(next);
      return next;
    });
  };

  const submit = () => {
    if (!canSubmit) return;

    const score = calculateDailyPoints(day);

    // Streak check for bonus
    const all = readCheckins();
    const streak = computeStreak(all, dayKey);
    let streakBonus = 0;
    if (streak > 0 && streak % 7 === 0) {
      streakBonus = 20;
      score.breakdown.push('7-day streak: +20 bonus');
    }

    // Missions & achievements
    const missionProgress = readMissionsProgress();
    const achievementProgress = readAchievementsProgress();

    const missionResult = evaluateMissions(
      {
        day,
        dayKey,
        lateCount: salahLateCountValue,
        completedCount,
        allCompleted: score.completedCount === 7
      },
      missionProgress
    );

    const totalCompletedDays = Object.values(all).filter((d) => d?.completed).length;
    const perfectDays = Object.values(all).filter((d) => countCompletedCategories(d.categories) === 7 && d.completed).length;

    const achievementResult = evaluateAchievements(
      {
        day,
        dayKey,
        lateCount: salahLateCountValue,
        completedCount,
        allCompleted: score.completedCount === 7,
        totalCompletedDays: totalCompletedDays + (completed ? 1 : 0),
        streak: completed ? streak + 1 : streak,
        perfectDays: perfectDays + (score.completedCount === 7 ? 1 : 0)
      },
      achievementProgress
    );

    const missionBonus = missionResult.earned.reduce((acc, m) => acc + m.points, 0);
    const achievementBonus = achievementResult.earned.reduce((acc, a) => acc + a.points, 0);

    missionResult.earned.forEach((m) => score.breakdown.push(`${m.title}: +${m.points}`));
    achievementResult.earned.forEach((a) => score.breakdown.push(`${a.title}: +${a.points}`));

    const totalPoints = score.points + streakBonus + missionBonus + achievementBonus;
    const user = readUser() || 'guest';

    const next: DayEntry = {
      ...day,
      submitted: true,
      completed,
      submittedAt: new Date().toISOString(),
      pointsAwarded: totalPoints,
      scoreBreakdown: score.breakdown
    };

    // Persist day and update derived stores
    setDay(next);
    all[dayKey] = next;
    writeCheckins(all);
    writeMissionsProgress(missionResult.updated);
    writeAchievementsProgress(achievementResult.updated);
    updateLeaderboard(user, totalPoints);
    appendPointsLog({ date: dayKey, points: totalPoints, breakdown: score.breakdown });

    // Sync to server
    const token = localStorage.getItem('mizan_token');
    if (token) {
      import('@/utils/api').then(({ saveCheckin }) => {
        saveCheckin(dayKey, next.categories, next.penalties.length, next.completed).catch(console.error);
      });
    }
  };

  return {
    dayKey,
    categories: day.categories,
    penalties: day.penalties,
    penaltiesResolved,
    canSubmit,
    submitted: day.submitted,
    completed,
    toggleSalahPrayer,
    toggleQuranOption,
    setQuranDuration,
    togglePhysicalOption,
    setPhysicalDuration,
    toggleBuildOption,
    setBuildDescription,
    toggleOptionalTask,
    togglePenalty,
    submit,
    salahComplete,
    salahLateCount: salahLateCountValue,
    quranComplete,
    physicalComplete,
    buildComplete,
    otherCategoriesCompleted
  };
}
