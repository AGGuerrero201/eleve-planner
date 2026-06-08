/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Existing tokens (unchanged) ──────────────────────
        gold: {
          DEFAULT: '#B8955A',
          light:   '#E8D5B0',
          dark:    '#9A7A42',
          // New: extended scale for subtle tints
          pale:    '#F5EFE6',
          ghost:   '#FBF7F2',
        },
        charcoal: {
          DEFAULT: '#1C1C1E',
          mid:     '#2D2D30',
          light:   '#4A4A50',
        },
        'off-white': '#FAFAF8',
        'warm-gray': '#F5F3EF',
        border:      '#E2DDD5',
        muted:       '#8A8580',

        // ── New: stone scale for section labels & secondary text ─
        stone: {
          DEFAULT: '#8C8478',
          dark:    '#5C5650',
          light:   '#B8B0A8',
          pale:    '#E8E4E0',
        },

        // ── New: status palette (muted, warm) ────────────────
        status: {
          'planning-bg':    '#EDEAE3',
          'planning-text':  '#6B5F4A',
          'confirmed-bg':   '#E5EDE5',
          'confirmed-text': '#3D5C3A',
          'underway-bg':    '#EAEAF0',
          'underway-text':  '#4A4870',
          'delivered-bg':   '#EDE8E2',
          'delivered-text': '#5C5040',
          'archived-bg':    '#EBEBEB',
          'archived-text':  '#6B6B6B',
        },
      },

      // ── Existing animations (unchanged) ─────────────────────
      animation: {
        'fade-up':   'fadeUp 0.4s ease both',
        'pulse-dot': 'pulseDot 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%':           { opacity: '1',   transform: 'scale(1)' },
        },
      },

      // ── Existing radius (unchanged) ──────────────────────────
      borderRadius: {
        DEFAULT: '2px',
        card:    '10px',   // new — for luxury card rounding
        badge:   '4px',    // new — for status badges
      },

      // ── New: letter spacing ──────────────────────────────────
      letterSpacing: {
        caps:    '0.10em',
        wide:    '0.04em',
        display: '0.01em',
      },

      // ── New: box shadows ─────────────────────────────────────
      boxShadow: {
        'card-hover': '0 2px 14px rgba(0, 0, 0, 0.055)',
        'card-lift':  '0 4px 24px rgba(0, 0, 0, 0.08)',
        'modal':      '0 8px 40px rgba(0, 0, 0, 0.12)',
      },

      // ── New: semantic spacing ────────────────────────────────
      spacing: {
        'section': '48px',
        'card-h':  '20px',
        'card-v':  '18px',
      },

      // ── New: max widths ──────────────────────────────────────
      maxWidth: {
        'content': '1100px',
        'reading': '680px',
      },

      // ── New: transition durations ────────────────────────────
      transitionDuration: {
        'card': '200ms',
        'fast': '150ms',
        'slow': '320ms',
      },
    },
  },
  plugins: [],
}
