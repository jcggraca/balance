import { Text } from '@mantine/core'
import { useIntl } from 'react-intl'
import iconsMap from './iconsMap'

interface IconRendererProps {
  icon: keyof typeof iconsMap
}

function IconRenderer({ icon }: IconRendererProps) {
  const intl = useIntl()

  const IconComponent = iconsMap[icon]
  if (!IconComponent)
    return <Text c="red">{intl.formatMessage({ id: 'iconNotFound' })}</Text>

  return <IconComponent />
}

export default IconRenderer
