import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AlertsStore {
  showChangelog: boolean
  setShowChangelog: (showChangelog: boolean) => void
}

export const useAlertsStore = create<AlertsStore>()(
  persist(
    set => ({
      showChangelog: false,
      setShowChangelog: showChangelog => set({ showChangelog }),
    }),
    {
      name: 'alerts-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
