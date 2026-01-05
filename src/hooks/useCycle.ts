import { useEffect, useMemo, useState } from 'react';
import { readCheckins, readCycles, writeCycles, CycleRecord, DayEntry } from '@/utils/storage';

function getCompletedDates(checkins: Record<string, DayEntry>): string[] {
  return Object.keys(checkins)
    .filter((key) => checkins[key]?.submitted && checkins[key]?.completed)
    .sort();
}

function buildCyclesFromDates(completedDates: string[]): CycleRecord[] {
  const cycles: CycleRecord[] = [];
  let current: CycleRecord = { id: `cycle-${cycles.length + 1}`, days: [] };

  completedDates.forEach((date) => {
    if (current.days.includes(date)) return;
    if (current.days.length === 7) {
      cycles.push(current);
      current = { id: `cycle-${cycles.length + 1}`, days: [] };
    }
    current.days.push(date);
  });

  if (current.days.length) {
    cycles.push(current);
  }

  return cycles;
}

export interface CycleState {
  cycles: CycleRecord[];
  cyclesCompleted: number;
  currentProgress: number;
}

export function useCycle(): CycleState {
  const [cycles, setCycles] = useState<CycleRecord[]>(() => readCycles());

  useEffect(() => {
    const checkins = readCheckins();
    const completedDates = getCompletedDates(checkins);
    const rebuilt = buildCyclesFromDates(completedDates);
    setCycles(rebuilt);
    writeCycles(rebuilt);
  }, []);

  const derived = useMemo(() => {
    const completedCycles = cycles.filter((c) => c.days.length === 7).length;
    const current = cycles[cycles.length - 1];
    const currentProgress = current ? Math.min(current.days.length, 7) : 0;
    return { cyclesCompleted: completedCycles, currentProgress };
  }, [cycles]);

  return {
    cycles,
    cyclesCompleted: derived.cyclesCompleted,
    currentProgress: derived.currentProgress
  };
}
