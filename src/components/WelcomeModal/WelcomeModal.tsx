import type { Category } from '@/db'
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
  const [checked, setChecked] = useState(true)

  const handleComplete = () => {
    if (checked) {
      // TODO: Translate the default Categories
      const defaultCategories: Category[] = [
        { id: uuidv4(), name: 'Housing', description: 'Rent, mortgage, property taxes, homeowners insurance.', color: '#F78DA7', icon: 'home', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Utilities', description: 'Electricity, gas, water, internet, phone.', color: '#61D095', icon: 'plug', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Transportation', description: 'Gas, car insurance, car maintenance, public transportation.', color: '#FFB84C', icon: 'car', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Education', description: 'Tuition, books, supplies.', color: '#9FA8DA', icon: 'book', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Loans', description: 'Loan payments, credit card payments.', color: '#E57373', icon: 'credit-card', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Food', description: 'Groceries, restaurants, snacks.', color: '#FFD166', icon: 'shopping-cart', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Entertainment', description: 'Movies, concerts, travel, hobbies.', color: '#84DCC6', icon: 'music', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Clothing', description: 'Clothes, shoes, accessories.', color: '#FF92B4', icon: 'shirt', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Gifts', description: 'Birthdays, holidays.', color: '#F7A072', icon: 'gift', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Pets', description: 'Food, vet bills, supplies.', color: '#A5D6A7', icon: 'paw', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Personal care', description: 'Haircuts, beauty products.', color: '#C792EA', icon: 'scissors', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Taxes', description: 'Income tax, property tax.', color: '#EF9A9A', icon: 'file-invoice', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Maintenance', description: 'Home repairs, car repairs.', color: '#4FC3F7', icon: 'tools', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Investments', description: 'Stocks, bonds, retirement savings.', color: '#FFD54F', icon: 'trending-up', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Donations', description: 'Charities.', color: '#81C784', icon: 'heart', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
        { id: uuidv4(), name: 'Other', description: 'Any expenses that don\'t fit into the above categories.', color: '#D1C4E9', icon: 'box', createdTimestamp: Date.now(), updatedTimestamp: Date.now() },
      ]

      db.categories.bulkAdd(defaultCategories)
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
        label={intl.formatMessage({ id: 'defaultCategories' })}
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
