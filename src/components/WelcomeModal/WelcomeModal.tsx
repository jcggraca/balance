import type { Types } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Checkbox, Group, Modal, Select, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

function WelcomeModal() {
  const intl = useIntl()
  const [opened, { close }] = useDisclosure(true)
  const { currency, setCurrency, language, setLanguage, setNewUser } = useSettingsStore()
  const [checked, setChecked] = useState(false)

  const handleComplete = () => {
    if (checked) {
      const defaultTypes: Types[] = [
        { id: uuidv4(), name: 'Housing', description: 'Rent, mortgage, property taxes, homeowners insurance.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Utilities', description: 'Electricity, gas, water, internet, phone.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Transportation', description: 'Gas, car insurance, car maintenance, public transportation.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Education', description: 'Tuition, books, supplies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Loans', description: 'Loan payments, credit card payments.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Food', description: 'Groceries, restaurants, snacks.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Entertainment', description: 'Movies, concerts, travel, hobbies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Clothing', description: 'Clothes, shoes, accessories.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Gifts', description: 'Birthdays, holidays.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Pets', description: 'Food, vet bills, supplies.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Personal care', description: 'Haircuts, beauty products.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Taxes', description: 'Income tax, property tax.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Maintenance', description: 'Home repairs, car repairs.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Investments', description: 'Stocks, bonds, retirement savings.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Donations', description: 'Charities.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Other', description: 'Any expenses that don\'t fit into the above categories.', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
      ]

      db.types.bulkAdd(defaultTypes)
    }
    setNewUser(true)
    close()
  }

  return (
    <Modal centered opened={opened} onClose={close}>
      <Title
        order={2}
        size="h1"
        fw={900}
        ta="center"
        mb="md"
      >
        {intl.formatMessage({ id: 'welcome' })}
      </Title>

      <Text size="lg" fw={500}>{intl.formatMessage({ id: 'welcomeDescription' })}</Text>

      <Select
        label={intl.formatMessage({ id: 'selectCurrency' })}
        value={currency}
        onChange={value => setCurrency(value || '€')}
        mt="md"
        data={[
          { value: '€', label: 'Euro (€)' },
          { value: '£', label: 'Pound (£)' },
          { value: '$', label: 'Dollar ($)' },
          { value: '¥', label: 'Yen (¥)' },
          { value: 'R$', label: 'Real (R$)' },
        ]}
      />

      <Select
        label={intl.formatMessage({ id: 'selectLanguage' })}
        value={language}
        onChange={value => setLanguage(value || 'en')}
        mt="md"
        data={[
          { value: 'en', label: intl.formatMessage({ id: 'english' }) },
          { value: 'pt', label: intl.formatMessage({ id: 'portuguese' }) },
        ]}
      />

      <Checkbox
        mt="md"
        label={intl.formatMessage({ id: 'askDefaultTypes' })}
        checked={checked}
        onChange={event => setChecked(event.currentTarget.checked)}
      />

      <Group justify="center" mt="xl">
        <Button onClick={handleComplete} type="submit" size="md">
          {intl.formatMessage({ id: 'complete' })}
        </Button>
      </Group>
    </Modal>
  )
}

export default WelcomeModal
