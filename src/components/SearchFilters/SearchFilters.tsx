import type { FC } from 'react'
import type { Account, Category } from '../../db'
import { Button, Grid, Group, Modal, Select, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
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
  searchAccount?: string
  accounts?: Account[]
  onSearchAccount?: (id: string | null) => void
  searchCategory?: string
  categories?: Category[]
  onSearchCategory?: (id: string | null) => void
  noFilters?: boolean
  showDateFilter?: boolean
}

const SearchFilters: FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  searchAccount,
  accounts,
  onSearchAccount,
  searchCategory,
  categories,
  onSearchCategory,
  noFilters = false,
  showDateFilter = true,
}) => {
  const intl = useIntl()
  const isMobile = useMediaQuery('(max-width: 48em)')
  const [opened, { open, close }] = useDisclosure(false)

  const filterContent = (
    <>
      {showDateFilter && dateRange && onDateRangeChange && (
        <>
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'startDate' })}
            value={dateRange.start}
            onChange={date => onDateRangeChange({ ...dateRange, start: date })}
            mb={isMobile ? 'md' : 0}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            placeholder={intl.formatMessage({ id: 'endDate' })}
            value={dateRange.end}
            onChange={date => onDateRangeChange({ ...dateRange, end: date })}
            mb={isMobile ? 'md' : 0}
          />

          {accounts && accounts?.length > 0 && (
            <Select
              placeholder={intl.formatMessage({ id: 'selectAccount' })}
              onChange={onSearchAccount}
              value={searchAccount || null}
              data={accounts?.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })}
            />
          )}

          {categories && categories?.length > 0 && (
            <Select
              placeholder={intl.formatMessage({ id: 'selectCategory' })}
              onChange={onSearchCategory}
              value={searchCategory || null}
              data={categories?.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })}
            />
          )}
        </>
      )}
    </>
  )

  return (
    <>
      {isMobile
        ? (
            <>
              <Grid>
                <Grid.Col span="auto">
                  <TextInput
                    placeholder={intl.formatMessage({ id: isMobile ? 'searchByName' : 'searchByNameAndDescription' })}
                    value={searchQuery}
                    onChange={e => onSearchChange(e.currentTarget.value)}
                  />
                </Grid.Col>

                {!noFilters && (
                  <Grid.Col span="content">
                    <Button onClick={open}>
                      <IconAdjustmentsHorizontal />
                    </Button>
                  </Grid.Col>
                )}
              </Grid>

              <Modal
                opened={opened}
                onClose={close}
                title={intl.formatMessage({ id: 'filters' })}
                styles={{
                  content: {
                    marginTop: 'auto',
                  },
                }}
              >
                {filterContent}

                <Group justify="center">
                  <Button onClick={onClearFilters}>
                    {intl.formatMessage({ id: 'clearFilters' })}
                  </Button>
                  <Button onClick={close}>
                    {intl.formatMessage({ id: 'close' })}
                  </Button>
                </Group>
              </Modal>
            </>
          )
        : (
            <Group>
              <TextInput
                placeholder={intl.formatMessage({ id: 'searchByNameAndDescription' })}
                value={searchQuery}
                onChange={e => onSearchChange(e.currentTarget.value)}
                w={250}
              />

              {filterContent}

              <Button onClick={onClearFilters}>
                {intl.formatMessage({ id: 'clearFilters' })}
              </Button>
            </Group>
          )}
    </>
  )
}

export default SearchFilters
