import { create } from 'zustand';

interface GameState {
  xp: number;
  level: number;
  achievements: any[]; // Replace 'any' with a proper type later
  currentPath: string | null;
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  addAchievement: (achievement: any) => void; // Replace 'any' with a proper type later
}

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  level: 1,
  achievements: [],
  currentPath: null,
  setXp: (xp) => set({ xp }),
  setLevel: (level) => set({ level }),
  addAchievement: (achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),
}));
