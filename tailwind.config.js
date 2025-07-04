/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/app.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['monospace'],
        serif: ['serif'],
        'system-ui': ['system-ui'],
        georgia: ['Georgia', 'serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        times: ['"Times New Roman"', 'Times', 'serif'],
        courier: ['"Courier New"', 'Courier', 'monospace'],
        comic: ['"Comic Sans MS"', 'cursive'],
        impact: ['Impact', 'Arial Black', 'sans-serif']
      }
    }
  },
  plugins: []
}; 