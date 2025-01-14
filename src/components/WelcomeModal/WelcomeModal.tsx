import type { Category } from '@/db'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button, Checkbox, Group, Modal, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import SelectCurrency from '../SelectCurrency'
import SelectLanguage from '../SelectLanguage'

function WelcomeModal() {
  const intl = useIntl()
  const [opened, { close }] = useDisclosure(true)
  const { setNewUser } = useSettingsStore()
  const [checked, setChecked] = useState(true)

  const handleComplete = () => {
    if (checked) {
      const defaultCategories: Category[] = [
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryHousing' }),
          description: intl.formatMessage({ id: 'defaultCategoryHousingDescription' }),
          color: '#F78DA7',
          icon: 'home',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryUtilities' }),
          description: intl.formatMessage({ id: 'defaultCategoryUtilitiesDescription' }),
          color: '#61D095',
          icon: 'plug',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryTransportation' }),
          description: intl.formatMessage({ id: 'defaultCategoryTransportationDescription' }),
          color: '#FFB84C',
          icon: 'car',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryEducation' }),
          description: intl.formatMessage({ id: 'defaultCategoryEducationDescription' }),
          color: '#9FA8DA',
          icon: 'book',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryLoans' }),
          description: intl.formatMessage({ id: 'defaultCategoryLoansDescription' }),
          color: '#E57373',
          icon: 'credit-card',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryFood' }),
          description: intl.formatMessage({ id: 'defaultCategoryFoodDescription' }),
          color: '#FFD166',
          icon: 'shopping-cart',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryEntertainment' }),
          description: intl.formatMessage({ id: 'defaultCategoryEntertainmentDescription' }),
          color: '#84DCC6',
          icon: 'music',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryClothing' }),
          description: intl.formatMessage({ id: 'defaultCategoryClothingDescription' }),
          color: '#FF92B4',
          icon: 'shirt',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryGifts' }),
          description: intl.formatMessage({ id: 'defaultCategoryGiftsDescription' }),
          color: '#F7A072',
          icon: 'gift',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryPets' }),
          description: intl.formatMessage({ id: 'defaultCategoryPetsDescription' }),
          color: '#A5D6A7',
          icon: 'paw',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryPersonalCare' }),
          description: intl.formatMessage({ id: 'defaultCategoryPersonalCareDescription' }),
          color: '#C792EA',
          icon: 'scissors',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryTaxes' }),
          description: intl.formatMessage({ id: 'defaultCategoryTaxesDescription' }),
          color: '#EF9A9A',
          icon: 'file-invoice',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryMaintenance' }),
          description: intl.formatMessage({ id: 'defaultCategoryMaintenanceDescription' }),
          color: '#4FC3F7',
          icon: 'tools',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryInvestments' }),
          description: intl.formatMessage({ id: 'defaultCategoryInvestmentsDescription' }),
          color: '#FFD54F',
          icon: 'trending-up',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryDonations' }),
          description: intl.formatMessage({ id: 'defaultCategoryDonationsDescription' }),
          color: '#81C784',
          icon: 'heart',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryOther' }),
          description: intl.formatMessage({ id: 'defaultCategoryOtherDescription' }),
          color: '#D1C4E9',
          icon: 'box',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
      ]

      db.categories.bulkAdd(defaultCategories)
    }
    setNewUser(false)
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

      <SelectCurrency />
      <SelectLanguage />

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
