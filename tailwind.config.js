/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#fbf8ff',
        surface: '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f4f2fb',
        'surface-container': '#eeedf6',
        'surface-container-high': '#e9e7f0',
        'surface-container-highest': '#e3e1ea',
        'on-background': '#1a1b21',
        'on-surface': '#1a1b21',
        'on-surface-variant': '#444652',
        outline: '#757684',
        'outline-variant': '#c5c5d4',
        primary: '#001558',
        'primary-container': '#00268a',
        'on-primary-container': '#7d94f9',
        'inverse-primary': '#b8c4ff',
        secondary: '#00658b',
        'secondary-container': '#3bc2ff',
        'on-secondary-container': '#004d6a',
        accent: '#00ACE8',
        'accent-soft': '#7dd0ff',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        success: '#16a34a',
        'success-soft': '#dcfce7',
        warning: '#f59e0b',
        'warning-soft': '#fef3c7',
        info: '#0ea5e9',
        'info-soft': '#e0f2fe',
        'status-available': '#16a34a',
        'status-available-soft': 'rgba(22,163,74,0.12)',
        'status-occupied': '#dc2626',
        'status-occupied-soft': 'rgba(220,38,38,0.12)',
        'status-reserved': '#f59e0b',
        'status-reserved-soft': 'rgba(245,158,11,0.14)',
        'status-offline': '#64748b',
        'status-offline-soft': 'rgba(100,116,139,0.14)',
        'status-maintenance': '#a855f7',
        'status-maintenance-soft': 'rgba(168,85,247,0.14)'
      },
      fontFamily: {
        heading: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        'headline-lg': ['"Hanken Grotesk"', 'sans-serif'],
        'headline-md': ['"Hanken Grotesk"', 'sans-serif'],
        'display-lg': ['"Hanken Grotesk"', 'sans-serif'],
        'body-md': ['Manrope', 'sans-serif'],
        'body-lg': ['Manrope', 'sans-serif'],
        'label-md': ['Manrope', 'sans-serif']
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
        level1: '0 4px 20px 0 rgba(0, 21, 88, 0.06)',
        level2: '0 8px 30px -4px rgba(0, 21, 88, 0.12)',
        glow: '0 0 0 4px rgba(0, 172, 232, 0.18)',
        focus: '0 0 0 4px rgba(0, 172, 232, 0.25)'
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 172, 232, 0.45)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0, 172, 232, 0)' }
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
