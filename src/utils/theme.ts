const themes: Record<string, Record<string, string>> = {
  dark: {
    '--bg': '#040a08',
    '--bg-2': '#0a1410',
    '--card': '#0f1b16',
    '--card-border': '#1d3a2e',
    '--card-inner': 'rgba(255, 255, 255, 0.01)',
    '--text': '#e8f5f0',
    '--muted': '#9dbfb5',
    '--accent': '#3dd98f',
    '--accent-2': '#6fff9e',
    '--shadow': '0 25px 60px rgba(0, 100, 60, 0.35)'
  },
  blue: {
    '--bg': '#04060b',
    '--bg-2': '#050913',
    '--card': '#0b1020',
    '--card-border': '#1a2440',
    '--card-inner': 'rgba(255, 255, 255, 0.02)',
    '--text': '#e8f2ff',
    '--muted': '#99aacc',
    '--accent': '#4da3ff',
    '--accent-2': '#8ad0ff',
    '--shadow': '0 25px 60px rgba(21, 40, 82, 0.45)'
  },
  pink: {
    '--bg': '#0b0509',
    '--bg-2': '#140812',
    '--card': '#1b0f18',
    '--card-border': '#2a1a26',
    '--card-inner': 'rgba(255, 255, 255, 0.02)',
    '--text': '#fce8f5',
    '--muted': '#d4a8c8',
    '--accent': '#ff5fa2',
    '--accent-2': '#ffd1e8',
    '--shadow': '0 25px 60px rgba(120, 20, 80, 0.4)'
  },
  default: {
    '--bg': '#040506',
    '--bg-2': '#0a0a0c',
    '--card': '#0d0f11',
    '--card-border': '#1c1e22',
    '--card-inner': 'rgba(255, 255, 255, 0.01)',
    '--text': '#e4e6ea',
    '--muted': '#9a9fa8',
    '--accent': '#2f6f4b',
    '--accent-2': '#b79652',
    '--shadow': '0 25px 60px rgba(0, 0, 0, 0.35)'
  },
  red: {
    '--bg': '#0c0505',
    '--bg-2': '#160707',
    '--card': '#1f0b0b',
    '--card-border': '#2d1414',
    '--card-inner': 'rgba(255, 255, 255, 0.02)',
    '--text': '#fce8e8',
    '--muted': '#d4a3a3',
    '--accent': '#ff6b6b',
    '--accent-2': '#ffb3a3',
    '--shadow': '0 25px 60px rgba(120, 24, 24, 0.4)'
  }
};

export function applyTheme(themeKey: string): string {
  const root = document.documentElement;
  const theme = themes[themeKey] || themes.dark;

  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.dataset.theme = themeKey;
  return themeKey in themes ? themeKey : 'dark';
}

export type ThemeKey = keyof typeof themes;
export const themeKeys = Object.keys(themes) as ThemeKey[];
