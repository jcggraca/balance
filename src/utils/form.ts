import type { IntlShape } from 'react-intl'
import { notifications } from '@mantine/notifications'

export function displayNotification(intl: IntlShape, title: string, message: string, color: string) {
  notifications.show({
    title: intl.formatMessage({ id: title }),
    message: intl.formatMessage({ id: message }),
    color,
  })
}
