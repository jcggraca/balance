import type { FC } from 'react'
import * as TablerIcons from '@tabler/icons-react'
import classes from './RenderIcon.module.css'

interface RenderIconProps {
  icon: string
  noStyle?: boolean
}

const RenderIcon: FC<RenderIconProps> = ({ icon, noStyle }) => {
  const iconName = `Icon${icon.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)).join('')}` as keyof typeof TablerIcons
  const IconComponent = TablerIcons[iconName] as React.ComponentType<{ size: number }> | null
  return (
    <div className={noStyle ? '' : classes.root}>
      {IconComponent ? <IconComponent size={24} /> : null}
    </div>
  )
}

export default RenderIcon
