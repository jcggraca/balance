import type { Category } from '@/db'
import AddCategory from '@/components/Category/AddCategory'
import ViewCategories from '@/components/Category/ViewCategory'
import GenericMobileList from '@/components/GenericMobileList'
import GenericTable from '@/components/GenericTable'
import IconRenderer from '@/components/IconRenderer'
import SearchFilters from '@/components/SearchFilters'
import { db } from '@/db'
import { Avatar } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconMoneybag } from '@tabler/icons-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'

const Categories: FC = () => {
  const intl = useIntl()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const [category, setCategory] = useState<Category | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const CategoriesList = useLiveQuery(async () => {
    let query = db.categories.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (category.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    return await query.toArray()
  }, [searchQuery])

  const handleClearFilters = () => {
    setSearchQuery('')
  }

  const columns = [
    {
      key: 'icon',
      header: intl.formatMessage({ id: 'icon' }),
      render: (item: Category) => (
        <>
          {'icon' in item
            ? (
                <Avatar color={item?.color ? item.color : 'green'} radius="xl">
                  {item?.icon ? <IconRenderer icon={item.icon} /> : <IconMoneybag />}
                </Avatar>
              )
            : <IconMoneybag />}
        </>
      ),
    },
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: Category) => item.name,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: Category) => item.description || 'N/A',
    },
  ]

  return (
    <>
      <div className="responsiveHeader">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={handleClearFilters}
          showDateFilter={false}
          noFilters
        />
        <AddCategory />
      </div>

      {category && <ViewCategories category={category} onClose={() => setCategory(undefined)} />}

      {isMobile
        ? (
            <GenericMobileList
              data={CategoriesList}
              onClick={item => setCategory(item as Category)}
              emptyMessage={intl.formatMessage({ id: 'noCategoryFound' })}
            />
          )
        : (
            <GenericTable
              data={CategoriesList}
              columns={columns}
              onClick={setCategory}
              emptyMessage={intl.formatMessage({ id: 'noCategoryFound' })}
            />
          )}
    </>
  )
}

export default Categories
