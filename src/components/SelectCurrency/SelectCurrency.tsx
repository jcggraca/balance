import { Select } from '@mantine/core'
import { useIntl } from 'react-intl'
import { useSettingsStore } from '../../stores/useSettingsStore'

function SelectCurrency() {
  const { currency, setCurrency } = useSettingsStore()
  const intl = useIntl()

  return (
    <Select
      label={`
        ${intl.formatMessage({ id: 'selectCurrency' })} 
        (${intl.formatMessage({ id: 'onlyVisual' })})
      `}
      value={currency}
      onChange={value => setCurrency(value || '€')}
      data={[
        { value: '€', label: 'Euro (€)' },
        { value: '£', label: 'Pound (£)' },
        { value: '$', label: 'Dollar ($)' },
        { value: '¥', label: 'Yen (¥)' },
        { value: 'R$', label: 'Real (R$)' },
      ]}
      allowDeselect={false}
    />
  )
}

export default SelectCurrency
