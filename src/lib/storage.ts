import { SavedChart } from './flowchartTypes';

const STORAGE_KEY = 'flowchart-builder-charts';

export function loadCharts(): SavedChart[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChart(chart: SavedChart, existingCharts: SavedChart[]): SavedChart[] {
  const updated = [...existingCharts.filter(c => c.name !== chart.name), chart];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteChart(chartName: string, existingCharts: SavedChart[]): SavedChart[] {
  const updated = existingCharts.filter(c => c.name !== chartName);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
