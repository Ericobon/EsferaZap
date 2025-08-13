// InsightEsfera Theme Configuration
// Consistent with main website branding

export const theme = {
  colors: {
    // Primary Colors (from InsightEsfera website)
    primary: {
      teal: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6', // Main teal
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c', // Main orange
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
    },
    // Neutral Colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  gradients: {
    primary: 'from-teal-600 via-teal-700 to-teal-800',
    secondary: 'from-orange-400 via-orange-500 to-orange-600',
    background: 'from-slate-50 via-white to-teal-50',
    card: 'from-white/80 to-white/60',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
};

// Theme provider for light/dark mode
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: 'teal' | 'orange';
}

export const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: 'teal',
};

// Get theme values based on mode
export const getThemeColors = (mode: 'light' | 'dark') => {
  if (mode === 'dark') {
    return {
      background: '#0f172a',
      foreground: '#f8fafc',
      card: '#1e293b',
      cardForeground: '#f1f5f9',
      border: '#334155',
      primary: theme.colors.primary.teal[400],
      secondary: theme.colors.primary.orange[400],
      muted: '#334155',
      mutedForeground: '#94a3b8',
    };
  }
  return {
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    border: '#e2e8f0',
    primary: theme.colors.primary.teal[600],
    secondary: theme.colors.primary.orange[500],
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
  };
};

// CSS variables for theme
export const generateCSSVariables = (mode: 'light' | 'dark') => {
  const colors = getThemeColors(mode);
  return `
    :root {
      --background: ${colors.background};
      --foreground: ${colors.foreground};
      --card: ${colors.card};
      --card-foreground: ${colors.cardForeground};
      --border: ${colors.border};
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --muted: ${colors.muted};
      --muted-foreground: ${colors.mutedForeground};
      --radius: 0.75rem;
    }
  `;
};