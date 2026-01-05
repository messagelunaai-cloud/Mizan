/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'button-glow': 'buttonGlow 0.5s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out',
        'progress-flow': 'progressFlow 3s ease-in-out infinite',
        'stagger-1': 'fadeInUp 0.6s ease-out 0.1s forwards',
        'stagger-2': 'fadeInUp 0.6s ease-out 0.2s forwards',
        'stagger-3': 'fadeInUp 0.6s ease-out 0.3s forwards',
        'stagger-4': 'fadeInUp 0.6s ease-out 0.4s forwards',
        'counter-tick': 'counterTick 0.3s ease-out',
        'checkbox-draw': 'checkboxDraw 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-border': 'pulseBorder 1.5s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'spin-smooth': 'spinSmooth 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'scale-bounce': 'scaleBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(45, 74, 58, 0.4)' },
          '50%': { boxShadow: '0 0 12px 4px rgba(45, 74, 58, 0.2)' }
        },
        buttonGlow: {
          'from': { boxShadow: '0 0 0px 0px rgba(45, 74, 58, 0)', transform: 'scale(1)' },
          'to': { boxShadow: '0 0 16px 4px rgba(45, 74, 58, 0.3)', transform: 'scale(1.02)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        },
        progressFlow: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 0%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
        counterTick: {
          '0%': { transform: 'scaleY(0.8)', opacity: '0.5' },
          '50%': { transform: 'scaleY(1.1)' },
          '100%': { transform: 'scaleY(1)', opacity: '1' }
        },
        checkboxDraw: {
          '0%': { strokeDashoffset: '10', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' }
        },
        slideDown: {
          'from': { maxHeight: '0', opacity: '0' },
          'to': { maxHeight: '500px', opacity: '1' }
        },
        slideUp: {
          'from': { maxHeight: '500px', opacity: '1' },
          'to': { maxHeight: '0', opacity: '0' }
        },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(45, 74, 58, 0.3)' },
          '50%': { borderColor: 'rgba(45, 74, 58, 0.8)' }
        },
        breathe: {
          '0%, 100%': { opacity: '0.10' },
          '50%': { opacity: '0.16' }
        },
        spinSmooth: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(180deg)' }
        },
        scaleBounce: {
          'from': { transform: 'scale(1)' },
          'to': { transform: 'scale(1.02)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '1000% 0%' },
          '100%': { backgroundPosition: '-1000% 0%' }
        }
      }
    }
  },
  plugins: []
};
