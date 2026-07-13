// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // All timetable colors
    'bg-blue-100', 'text-blue-900', 'border-blue-500',
    'bg-green-100', 'text-green-900', 'border-green-500', 'bg-green-600',
    'bg-purple-100', 'text-purple-900', 'border-purple-500',
    'bg-orange-100', 'text-orange-900', 'border-orange-500',
    'bg-yellow-100', 'text-yellow-900', 'border-yellow-500',
    'bg-pink-100', 'text-pink-900', 'border-pink-500',  // ← Pink for online
    'border-l-4', 'border-2', 'border-dashed',
  ],
  plugins: [require("tailwindcss-animate")],
};

export default config;
