import { Select } from '@mantine/core'
import { useIntl } from 'react-intl'
import { useSettingsStore } from '../../stores/useSettingsStore'

function SelectLanguage() {
  const { language, setLanguage } = useSettingsStore()
  const intl = useIntl()

  return (
    <Select
      label={intl.formatMessage({ id: 'selectLanguage' })}
      value={language}
      onChange={value => setLanguage(value || 'en')}
      data={[
        { value: 'en', label: intl.formatMessage({ id: 'english' }) },
        { value: 'pt', label: intl.formatMessage({ id: 'portuguese' }) },
      ]}
      allowDeselect={false}
    />
  )
}

export default SelectLanguage
