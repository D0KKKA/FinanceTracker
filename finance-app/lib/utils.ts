import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Chart colors - light mode
export const CHART_COLORS_LIGHT = {
  chart1: '#a78bfa',      // oklch(0.65 0.25 265) - blue/purple
  chart2: '#06b6d4',      // oklch(0.7 0.2 160) - cyan
  chart3: '#f97316',      // oklch(0.6 0.22 25) - orange
  chart4: '#d946ef',      // oklch(0.68 0.18 310) - magenta
  chart5: '#eab308',      // oklch(0.72 0.15 50) - yellow
  card: '#1a1a1a',        // oklch(0.15 0.025 265)
  border: '#404040',      // oklch(0.25 0.03 265)
  mutedForeground: '#808080', // oklch(0.55 0.02 265)
}

// Chart colors - dark mode
export const CHART_COLORS_DARK = {
  chart1: '#c4b5fd',      // oklch(0.488 0.243 264.376) - bright purple
  chart2: '#22d3ee',      // oklch(0.696 0.17 162.48) - bright cyan
  chart3: '#fbbf24',      // oklch(0.769 0.188 70.08) - bright yellow
  chart4: '#f472b6',      // oklch(0.627 0.265 303.9) - bright pink
  chart5: '#ef5350',      // oklch(0.645 0.246 16.439) - bright red
  card: '#262626',        // oklch(0.145 0 0)
  border: '#525252',      // oklch(0.269 0 0)
  mutedForeground: '#a3a3a3', // oklch(0.708 0 0)
}

export function getChartColors(): string[] {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const colors = isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT
  return [colors.chart1, colors.chart2, colors.chart3, colors.chart4, colors.chart5]
}

export function getChartColorPalette() {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT
}
