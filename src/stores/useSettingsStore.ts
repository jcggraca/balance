import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsStore {
  currency: string
  language: string
  lastBackup: string | null
  newUser: boolean
  setCurrency: (currency: string) => void
  setLanguage: (language: string) => void
  setLastBackup: (lastBackup: string | null) => void
  setNewUser: (newUser: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      currency: '€',
      language: 'en',
      lastBackup: null,
      newUser: false,
      setCurrency: currency => set({ currency }),
      setLanguage: language => set({ language }),
      setLastBackup: lastBackup => set({ lastBackup }),
      setNewUser: newUser => set({ newUser }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
