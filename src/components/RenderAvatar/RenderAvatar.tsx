import type { Category, Expense, Income } from '@/db'
import type { FC } from 'react'
import type iconsMap from '../IconRenderer/iconsMap'
import { Avatar } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import IconRenderer from '../IconRenderer'

interface RenderAvatarProps {
  displayError: boolean
  item: Income | Expense
  placeholderIcon: keyof typeof iconsMap
  categories?: Category[]
}

const RenderAvatar: FC<RenderAvatarProps> = ({ displayError, item, categories, placeholderIcon }) => {
  if (displayError) {
    return (
      <Avatar color="red" radius="xl">
        <IconAlertTriangle />
      </Avatar>
    )
  }

  const categoryData = 'category' in item && categories?.find(o => o.id === item?.category)
  const color = categoryData && 'color' in categoryData ? categoryData.color : 'green'
  const icon = <IconRenderer icon={(categoryData && categoryData.icon) || placeholderIcon} />

  return (
    <Avatar color={color} radius="xl">
      {icon}
    </Avatar>
  )
}

export default RenderAvatar
