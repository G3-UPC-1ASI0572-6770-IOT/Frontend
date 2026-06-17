/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Brand palette: Midnight Navy + Electric Teal */
        background: '#F5F3EF',
        surface: '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#EFEDE8',
        'surface-container': '#E8E5E0',
        'surface-container-high': '#DEDAD4',
        'surface-container-highest': '#D5D1CB',
        'on-background': '#040c1b',
        'on-surface': '#1A1918',
        'on-surface-variant': '#57534E',
        outline: '#A8A29E',
        'outline-variant': '#E7E5E0',
        /* Midnight navy */
        primary: '#040c1b',
        'primary-container': '#0d1e36',
        'on-primary': '#ffffff',
        'on-primary-container': '#5effe6',
        /* Teal accent */
        accent: '#00d4aa',
        'accent-hover': '#00bfa0',
        'accent-soft': 'rgba(0,212,170,0.12)',
        'accent-glow': 'rgba(0,212,170,0.30)',
        /* Secondary */
        secondary: '#78716C',
        'secondary-container': '#D6D3D1',
        /* Amber as status/warning */
        amber: '#fbbf24',
        'amber-soft': 'rgba(251,191,36,0.12)',
        /* Status */
        error: '#E11D48',
        'error-container': '#FFE4E6',
        success: '#10B981',
        'success-soft': 'rgba(16,185,129,0.12)',
        warning: '#fbbf24',
        'warning-soft': 'rgba(251,191,36,0.12)',
        info: '#0ea5e9',
        'info-soft': '#e0f2fe',
        'status-available': '#10B981',
        'status-available-soft': 'rgba(16,185,129,0.12)',
        'status-occupied': '#F43F5E',
        'status-occupied-soft': 'rgba(244,63,94,0.12)',
        'status-reserved': '#fbbf24',
        'status-reserved-soft': 'rgba(251,191,36,0.14)',
        'status-offline': '#A8A29E',
        'status-offline-soft': 'rgba(168,162,158,0.14)',
        'status-maintenance': '#A78BFA',
        'status-maintenance-soft': 'rgba(167,139,250,0.14)'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        'headline-lg': ['"Space Grotesk"', 'sans-serif'],
        'headline-md': ['"Space Grotesk"', 'sans-serif'],
        'display-lg': ['"Space Grotesk"', 'sans-serif'],
        'body-md': ['DM Sans', 'sans-serif'],
        'body-lg': ['DM Sans', 'sans-serif'],
        'label-md': ['DM Sans', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }]
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        pill: '999px'
      },
      boxShadow: {
        level1: '0 4px 20px 0 rgba(4,12,27,0.06)',
        level2: '0 8px 30px -4px rgba(4,12,27,0.12)',
        glow: '0 0 0 4px rgba(0,212,170,0.18)',
        focus: '0 0 0 4px rgba(0,212,170,0.22)'
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,170,0.45)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0,212,170,0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 240ms ease-out both',
        'pulse-ring': 'pulseRing 1.8s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite'
      },
      maxWidth: {
        canvas: '1440px'
      }
    }
  },
  plugins: []
};
