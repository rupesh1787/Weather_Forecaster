/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        appBg: '#0B1220',
        card: '#111827',
        appBorder: '#1F2937',
        accent: '#3B82F6',
        forecast: '#22C55E',
        actual: '#60A5FA',
        errorBar: '#F97316',
        textPrimary: '#E5E7EB',
        textSecondary: '#9CA3AF',
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
        lightTextPrimary: '#0F172A',
        lightTextSecondary: '#475569'
      },
      boxShadow: {
        panel: '0 10px 40px rgba(15, 23, 42, 0.35)',
        glow: '0 0 0 1px rgba(59,130,246,0.25), 0 10px 30px rgba(59,130,246,0.2)'
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
