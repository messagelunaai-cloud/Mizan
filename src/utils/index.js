const routes = {
  Landing: '/',
  Access: '/access',
  CheckIn: '/checkin',
  Status: '/status',
  Settings: '/settings'
};

const STORAGE_KEY = 'mizan:entries';
const ACCESS_KEY = 'mizan:access';
const USER_KEY = 'mizan:user';
const SETTINGS_KEY = 'mizan:settings';
const ACCESS_CODES = ['mizan', 'discipline', 'quiet', '2008'];

export const DISCIPLINES = [
  { id: 'prayer', label: 'Prayer', description: 'Five daily obligations' },
  { id: 'quran', label: "Qur'an", description: 'Reading or reflection' },
  { id: 'training', label: 'Training', description: 'Physical discipline' },
  { id: 'build', label: 'Build', description: 'Productive work' },
  { id: 'character', label: 'Character', description: 'Kindness or restraint' }
];

export function createPageUrl(page) {
  return routes[page] || '/';
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error('Failed to parse persisted data', err);
    return null;
  }
}

function readEntries() {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function writeEntries(entries) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function normalizeDisciplines(value = {}) {
  return DISCIPLINES.reduce((acc, item) => {
    acc[item.id] = Boolean(value[item.id]);
    return acc;
  }, {});
}

export function loadDay(key) {
  const entries = readEntries();
  const day = entries[key] || {};
  const disciplines = normalizeDisciplines(day.disciplines);
  const completed = DISCIPLINES.every((d) => disciplines[d.id]);
  return { disciplines, completed, completedAt: day.completedAt || null };
}

export function saveDay(key, disciplines) {
  const normalized = normalizeDisciplines(disciplines);
  const completed = DISCIPLINES.every((d) => normalized[d.id]);
  const entries = readEntries();
  entries[key] = {
    disciplines: normalized,
    completedAt: completed ? new Date().toISOString() : null
  };
  writeEntries(entries);
  return { ...entries[key], completed };
}

export function hasAccess() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ACCESS_KEY) === 'granted';
}

export function grantAccess() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_KEY, 'granted');
}

export function saveUser(username) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_KEY, username || '');
}

export function getUser() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(USER_KEY) || '';
}

export function validateAccessCode(value) {
  if (!value) return false;
  const trimmed = value.trim();
  const isFourDigits = /^\d{4}$/.test(trimmed);
  return isFourDigits || ACCESS_CODES.includes(trimmed.toLowerCase());
}

export function getSettings() {
  if (typeof window === 'undefined') return { focusPhrase: 'Consistency is earned.', reminderTime: '' };
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return {
    focusPhrase: parsed?.focusPhrase || 'Consistency is earned.',
    reminderTime: parsed?.reminderTime || ''
  };
}

export function saveSettings(next) {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  const merged = { ...current, ...next };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(SETTINGS_KEY);
}

function sortedDateKeys(entries) {
  return Object.keys(entries).sort();
}

function isConsecutive(prev, current) {
  const prevDate = new Date(prev);
  const nextDate = new Date(current);
  const diff = nextDate.getTime() - prevDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return diff === oneDay;
}

export function getStats() {
  const entries = readEntries();
  const keys = sortedDateKeys(entries);
  if (!keys.length) {
    return {
      daysCheckedIn: 0,
      cyclesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      recent: []
    };
  }

  let daysCheckedIn = 0;
  let totalTasks = 0;
  let doneTasks = 0;
  const dayCompletionMap = {};

  keys.forEach((key) => {
    const { disciplines } = entries[key] || {};
    const normalized = normalizeDisciplines(disciplines);
    const values = Object.values(normalized);
    const dayHasAny = values.some(Boolean);
    const dayComplete = values.length ? values.every(Boolean) : false;
    if (dayHasAny) daysCheckedIn += 1;
    totalTasks += DISCIPLINES.length;
    doneTasks += values.filter(Boolean).length;
    dayCompletionMap[key] = dayComplete;
  });

  const { currentStreak, longestStreak } = computeStreaks(dayCompletionMap);
  const { cycles } = buildCyclesFromMap(dayCompletionMap);
  const completionRate = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const recentKeys = keys.slice(-14);
  const recent = recentKeys.map((key) => ({
    key,
    percent: dayCompletionMap[key] ? 100 : 0
  }));

  return {
    daysCheckedIn,
    cyclesCompleted: cycles.filter((c) => c.complete).length,
    currentStreak,
    longestStreak,
    completionRate,
    recent
  };
}

function computeStreaks(dayCompletionMap) {
  const keys = Object.keys(dayCompletionMap).sort();
  if (!keys.length) return { currentStreak: 0, longestStreak: 0 };

  let longest = 0;
  let currentRun = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if (dayCompletionMap[keys[i]]) {
      currentRun += 1;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 0;
    }
  }

  // Current streak counts back from today.
  let currentStreak = 0;
  const todayKey = getTodayKey();
  let cursor = todayKey;
  while (dayCompletionMap[cursor]) {
    currentStreak += 1;
    const cursorDate = new Date(cursor);
    cursorDate.setDate(cursorDate.getDate() - 1);
    cursor = getTodayKey(cursorDate);
  }

  return { currentStreak, longestStreak: longest };
}

export function buildCycles() {
  const entries = readEntries();
  const dayCompletionMap = {};
  Object.keys(entries).forEach((key) => {
    const normalized = normalizeDisciplines(entries[key]?.disciplines);
    dayCompletionMap[key] = Object.values(normalized).every(Boolean);
  });
  return buildCyclesFromMap(dayCompletionMap);
}

function buildCyclesFromMap(dayCompletionMap) {
  const keys = Object.keys(dayCompletionMap).sort();
  const cycles = [];
  if (!keys.length) return { cycles };

  let bucket = [];
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const prev = bucket.length ? bucket[bucket.length - 1].key : null;
    const consecutive = prev ? isConsecutive(prev, key) : true;
    if (!consecutive) {
      if (bucket.length) {
        cycles.push(makeCycle(bucket));
      }
      bucket = [];
    }
    bucket.push({ key, complete: Boolean(dayCompletionMap[key]) });

    if (bucket.length === 7) {
      cycles.push(makeCycle(bucket));
      bucket = [];
    }
  }

  if (bucket.length) {
    cycles.push(makeCycle(bucket));
  }

  return { cycles };
}

export function getHistory(limit = 30) {
  const entries = readEntries();
  const keys = sortedDateKeys(entries).reverse().slice(0, limit);
  return keys.map((key) => {
    const normalized = normalizeDisciplines(entries[key]?.disciplines);
    const values = Object.values(normalized);
    const percent = values.length ? Math.round((values.filter(Boolean).length / values.length) * 100) : 0;
    return { key, disciplines: normalized, percent, complete: values.every(Boolean) };
  });
}

function makeCycle(days) {
  const padded = [...days];
  while (padded.length < 7) {
    padded.push({ key: null, complete: false });
  }
  const complete = padded.every((d) => d.complete && d.key);
  return { days: padded, complete };
}
