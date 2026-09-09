import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-josefin-sans)', 'sans-serif'],
  			heading: ['var(--font-josefin-sans)', 'sans-serif'],
  			logo: ['var(--font-montserrat)', 'sans-serif'],
  		},
  		boxShadow: {
  			'brand-xs': '0 4px 12px rgba(17,24,39,0.05)',
  			'brand-sm': '0 12px 28px rgba(48,121,68,0.08)',
  			'brand-md': '0 24px 60px rgba(48,121,68,0.14)',
  			'brand-lg': '0 28px 70px rgba(48,121,68,0.16)',
  		},
  		colors: {
  			brand: {
  				green: '#307944',
  				'green-dark': '#265e36',
  				'green-light': '#eef7f0',
  				'green-lighter': '#f5faf6',
  				border: '#d7e6da',
  				brown: '#724420',
  				'brown-light': '#8b5a3c'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
