import { create } from 'zustand';

interface GameState {
  xp: number;
  level: number;
  achievements: string[];
  progress: number;
  setXP: (xp: number) => void;
  setLevel: (level: number) => void;
  addAchievement: (achievement: string) => void;
  setProgress: (progress: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  level: 1,
  achievements: [],
  progress: 0,
  setXP: (xp) => set((state) => ({ xp: state.xp + xp })),
  setLevel: (level) => set({ level }),
  addAchievement: (achievement) =>
    set((state) => ({ achievements: [...state.achievements, achievement] })),
  setProgress: (progress) => set({ progress }),
}));