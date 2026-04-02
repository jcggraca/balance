import { ActionIcon, Group, Tabs, Text } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useState } from 'react'

interface DashboardHeaderProps {
  lengthMonths: number
  selectedMonth: string
  setSelectedMonth: (data: string) => void
}

export default function DashboardHeader({ lengthMonths, selectedMonth, setSelectedMonth }: DashboardHeaderProps) {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)

  const monthOptions = Array.from({ length: lengthMonths }, (_, i) => {
    const date = dayjs().subtract((lengthMonths - 1) - i, 'month')
    return {
      value: date.format('YYYY-MM'),
      label: date.format('MMMM'),
      year: date.format('YYYY'),
    }
  })

  const visibleMonths = monthOptions.slice(
    visibleStartIndex,
    visibleStartIndex + 6,
  )

  return (
    <Group gap={0} mb="md" style={{ width: '100%' }}>
      <ActionIcon
        variant="subtle"
        onClick={() =>
          setVisibleStartIndex(prev => Math.max(0, prev - 1))}
        disabled={visibleStartIndex === 0}
      >
        <IconChevronLeft size={16} />
      </ActionIcon>

      <Tabs
        value={selectedMonth}
        onChange={value =>
          setSelectedMonth(value || dayjs().format('YYYY-MM'))}
        style={{ flex: 1 }}
      >
        <Tabs.List style={{ width: '100%' }}>
          {visibleMonths.map(month => (
            <Tabs.Tab
              key={month.value}
              value={month.value}
              style={{ flex: 1 }}
            >
              <Text tt="capitalize">{month.label}</Text>
              <Text size="xs" c="dimmed">
                {month.year}
              </Text>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <ActionIcon
        variant="subtle"
        onClick={() =>
          setVisibleStartIndex(prev =>
            Math.min(monthOptions.length - 6, prev + 1),
          )}
        disabled={visibleStartIndex >= monthOptions.length - 6}
      >
        <IconChevronRight size={16} />
      </ActionIcon>
    </Group>
  )
}
