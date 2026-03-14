import { create } from 'zustand';
import { FitnessScores, PerformanceMetrics, calculateScores } from '@/lib/scoring';

interface CalculatorState {
  metrics: PerformanceMetrics | null;
  scores: FitnessScores | null;
  setMetrics: (metrics: PerformanceMetrics) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  metrics: null,
  scores: null,
  setMetrics: (metrics) => {
    const scores = calculateScores(metrics);
    set({ metrics, scores });
  },
  reset: () => set({ metrics: null, scores: null }),
}));
