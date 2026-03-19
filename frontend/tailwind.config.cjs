/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        appBg: '#EAF3FF',
        card: '#F7FBFF',
        appBorder: '#C6DDF5',
        accent: '#2F6FDF',
        forecast: '#1EA672',
        actual: '#3F8CFF',
        errorBar: '#F59E0B',
        textPrimary: '#102A43',
        textSecondary: '#4C6784',
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
        lightTextPrimary: '#0F172A',
        lightTextSecondary: '#475569'
      },
      boxShadow: {
        panel: '0 12px 34px rgba(43, 95, 171, 0.16)',
        glow: '0 0 0 1px rgba(47,111,223,0.25), 0 12px 24px rgba(47,111,223,0.2)'
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        rise: 'rise 450ms ease-out both'
      }
    }
  },
  plugins: []
};
