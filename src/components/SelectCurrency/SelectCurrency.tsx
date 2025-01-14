import { useSettingsStore } from '@/stores/useSettingsStore'
import { Select } from '@mantine/core'
import { useIntl } from 'react-intl'

function SelectCurrency() {
  const { currency, setCurrency } = useSettingsStore()
  const intl = useIntl()

  return (
    <Select
      label={intl.formatMessage({ id: 'selectCurrency' })}
      value={currency}
      onChange={value => setCurrency(value || '€')}
      data={[
        { value: '€', label: 'Euro (€)' },
        { value: '£', label: 'Pound (£)' },
        { value: '$', label: 'Dollar ($)' },
        { value: '¥', label: 'Yen (¥)' },
        { value: 'R$', label: 'Real (R$)' },
      ]}
    />
  )
}

export default SelectCurrency
