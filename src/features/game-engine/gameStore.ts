import { create } from 'zustand'

type Achievement = {
  id: string
  name: string
  earned: boolean
}

type GameState = {
  xp: number
  level: number
  currentPath: string | null
  progress: Record<string, number> // pathId → % complete
  achievements: Achievement[]
  addXP: (amount: number) => void
  setProgress: (pathId: string, percent: number) => void
  unlockAchievement: (id: string) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  xp: 0,
  level: 1,
  currentPath: null,
  progress: {},
  achievements: [
    { id: 'first_login', name: 'Welcome, Hero', earned: false },
    { id: 'chat_complete', name: 'Identity Forged', earned: false }
  ],

  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount
    const newLevel = Math.floor(newXP / 100) + 1
    return { xp: newXP, level: newLevel }
  }),

  setProgress: (pathId, percent) => set((state) => ({
    progress: { ...state.progress, [pathId]: percent }
  })),

  unlockAchievement: (id) => set((state) => ({
    achievements: state.achievements.map(a =>
      a.id === id ? { ...a, earned: true } : a
    )
  }))
}))