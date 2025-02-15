import { describe, expect, it, vi } from 'vitest'
import { customRender, fireEvent, screen } from '../../test-utils'
import GenericTable from './GenericTable'

interface TestData {
  id: number
  name: string
}

describe('genericTable', () => {
  const columns = [
    { key: 'id', header: 'ID', render: (item: TestData) => item.id },
    { key: 'name', header: 'Name', render: (item: TestData) => item.name },
  ]

  const data = [
    { id: 1, name: 'Transports' },
    { id: 2, name: 'Education' },
  ]

  it('renders table with data', () => {
    customRender(<GenericTable data={data} columns={columns} emptyMessage="No data available" />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Transports')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders empty message when no data', () => {
    customRender(<GenericTable data={[]} columns={columns} emptyMessage="No data available" />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('calls onClick when row is clicked', () => {
    const handleClick = vi.fn()
    customRender(<GenericTable data={data} columns={columns} emptyMessage="No data available" onClick={handleClick} />)

    const row = screen.getByText('Transports').closest('tr')
    fireEvent.click(row!)

    expect(handleClick).toHaveBeenCalledWith({ id: 1, name: 'Transports' })
  })
})
