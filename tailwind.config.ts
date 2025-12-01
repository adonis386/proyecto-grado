import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        inn: {
          primary: '#6B8E23', // Verde oliva del logo
          secondary: '#9ACD32', // Verde claro
          accent: '#A0522D', // Marrón/rojo del logo
          dark: '#3D5A00',
          light: '#F5F5DC',
        },
      },
    },
  },
  plugins: [],
}
export default config

