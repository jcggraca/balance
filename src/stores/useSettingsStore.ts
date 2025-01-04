import { create } from 'zustand'

interface SettingsStore {
  currency: string
  setCurrency: (currency: string) => void
}

export const useSettingsStore = create<SettingsStore>(set => ({
  currency: '€',
  setCurrency: currency => set({ currency }),
}))
