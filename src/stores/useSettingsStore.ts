import dayjs from 'dayjs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsStore {
  currency: string
  language: string
  lastBackup: number
  newUser: boolean
  setCurrency: (currency: string) => void
  setLanguage: (language: string) => void
  setLastBackup: (lastBackup: number) => void
  setNewUser: (newUser: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      currency: '€',
      language: 'en',
      lastBackup: dayjs().valueOf(),
      newUser: true,
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
