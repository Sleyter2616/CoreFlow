/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#111111',
        },
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#0072f5',
          600: '#005bc4',
          700: '#004493',
          800: '#002e62',
          900: '#001731',
        },
        success: {
          50: '#e6faf5',
          100: '#cdf5eb',
          200: '#9bebd7',
          300: '#69e0c3',
          400: '#37d6af',
          500: '#05cc9b',
          600: '#04a37c',
          700: '#037a5d',
          800: '#02523e',
          900: '#01291f',
        },
        warning: {
          50: '#fef4e6',
          100: '#fde9cc',
          200: '#fbd399',
          300: '#f9bd66',
          400: '#f7a733',
          500: '#f59100',
          600: '#c47400',
          700: '#935700',
          800: '#623a00',
          900: '#311d00',
        },
      },
    },
  },
  plugins: [],
}
