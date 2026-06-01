import { Platform } from 'react-native';

// ─── Color Palette ────────────────────────────────────────────
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    tint: '#16A34A', // BioLearn green
    accent: '#059669',
    icon: '#687076',
    border: '#E2E8F0',
    tabIconDefault: '#687076',
    tabIconSelected: '#16A34A',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0F172A',
    surface: '#1E293B',
    tint: '#4ADE80',
    accent: '#34D399',
    icon: '#9BA1A6',
    border: '#334155',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#4ADE80',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
  },
};

// ─── Typography ───────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Spacing ──────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────
export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
