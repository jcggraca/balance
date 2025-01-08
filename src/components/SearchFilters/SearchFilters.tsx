import type { FC } from 'react'
import { Button, Group, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useIntl } from 'react-intl'

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  dateRange?: {
    start: Date | null
    end: Date | null
  }
  onDateRangeChange?: (range: { start: Date | null, end: Date | null }) => void
  onClearFilters: () => void
  showDateFilter?: boolean
}

const SearchFilters: FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  showDateFilter = true,
}) => {
  const intl = useIntl()

  return (
    <Group>
      <TextInput
        placeholder={intl.formatMessage({ id: 'searchByNameAndDescription' })}
        value={searchQuery}
        onChange={e => onSearchChange(e.currentTarget.value)}
        w={250}
      />

      {showDateFilter && dateRange && onDateRangeChange && (
        <>
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'startDate' })}
            value={dateRange.start}
            onChange={date => onDateRangeChange({ ...dateRange, start: date })}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'endDate' })}
            value={dateRange.end}
            onChange={date => onDateRangeChange({ ...dateRange, end: date })}
          />
        </>
      )}

      <Button onClick={onClearFilters}>
        {intl.formatMessage({ id: 'clearFilters' })}
      </Button>
    </Group>
  )
}

export default SearchFilters
