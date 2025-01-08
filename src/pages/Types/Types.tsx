import type { Types as TypesType } from '@/db'
import GenericTable from '@/components/GenericTable'
import SearchFilters from '@/components/SearchFilters'
import AddTypes from '@/components/Types/AddTypes'
import ViewTypes from '@/components/Types/ViewTypes'
import { db } from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { type FC, useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './Types.module.css'

const Types: FC = () => {
  const intl = useIntl()
  const [type, setType] = useState<TypesType | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const typesList = useLiveQuery(async () => {
    let query = db.types.orderBy('updatedTimestamp')

    if (searchQuery) {
      query = query.filter(type =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase())
        || (type.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
      )
    }

    return await query.toArray()
  }, [searchQuery])

  const handleClearFilters = () => {
    setSearchQuery('')
  }

  const columns = [
    {
      key: 'name',
      header: intl.formatMessage({ id: 'name' }),
      render: (item: TypesType) => item.name,
    },
    {
      key: 'description',
      header: intl.formatMessage({ id: 'description' }),
      render: (item: TypesType) => item.description || 'N/A',
    },
  ]

  return (
    <>
      <div className={classes.header}>
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={handleClearFilters}
          showDateFilter={false}
        />
        <AddTypes />
      </div>

      {type && <ViewTypes type={type} onClose={() => setType(undefined)} />}

      <GenericTable
        data={typesList}
        columns={columns}
        onRowClick={setType}
        isLoading={!typesList}
        emptyMessage={intl.formatMessage({ id: 'noTypesFound' })}
      />
    </>
  )
}

export default Types
