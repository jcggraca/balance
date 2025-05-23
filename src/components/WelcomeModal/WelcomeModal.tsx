import type { Category } from '../../db'
import { Anchor, Button, Checkbox, Group, Modal, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'
import SelectCurrency from '../SelectCurrency'
import SelectLanguage from '../SelectLanguage'

function WelcomeModal() {
  const intl = useIntl()
  const [opened, { close }] = useDisclosure(true)
  const { setNewUser } = useSettingsStore()

  const [checkedCategories, setCheckedCategories] = useState(true)
  const [checkedTerms, setCheckedTerms] = useState(false)

  const handleComplete = () => {
    if (checkedCategories) {
      const defaultCategories: Category[] = [
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryHousing' }),
          description: intl.formatMessage({ id: 'defaultCategoryHousingDescription' }),
          color: '#F78DA7',
          icon: 'IconHome',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryUtilities' }),
          description: intl.formatMessage({ id: 'defaultCategoryUtilitiesDescription' }),
          color: '#61D095',
          icon: 'IconPlug',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryTransportation' }),
          description: intl.formatMessage({ id: 'defaultCategoryTransportationDescription' }),
          color: '#FFB84C',
          icon: 'IconCar',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryEducation' }),
          description: intl.formatMessage({ id: 'defaultCategoryEducationDescription' }),
          color: '#9FA8DA',
          icon: 'IconBook',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryLoans' }),
          description: intl.formatMessage({ id: 'defaultCategoryLoansDescription' }),
          color: '#E57373',
          icon: 'IconCreditCard',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryFood' }),
          description: intl.formatMessage({ id: 'defaultCategoryFoodDescription' }),
          color: '#FFD166',
          icon: 'IconShoppingCart',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryEntertainment' }),
          description: intl.formatMessage({ id: 'defaultCategoryEntertainmentDescription' }),
          color: '#84DCC6',
          icon: 'IconMusic',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryClothing' }),
          description: intl.formatMessage({ id: 'defaultCategoryClothingDescription' }),
          color: '#FF92B4',
          icon: 'IconShirt',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryGifts' }),
          description: intl.formatMessage({ id: 'defaultCategoryGiftsDescription' }),
          color: '#F7A072',
          icon: 'IconGift',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryPets' }),
          description: intl.formatMessage({ id: 'defaultCategoryPetsDescription' }),
          color: '#A5D6A7',
          icon: 'IconPaw',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryPersonalCare' }),
          description: intl.formatMessage({ id: 'defaultCategoryPersonalCareDescription' }),
          color: '#C792EA',
          icon: 'IconScissors',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryTaxes' }),
          description: intl.formatMessage({ id: 'defaultCategoryTaxesDescription' }),
          color: '#EF9A9A',
          icon: 'IconFileInvoice',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryMaintenance' }),
          description: intl.formatMessage({ id: 'defaultCategoryMaintenanceDescription' }),
          color: '#4FC3F7',
          icon: 'IconTools',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryInvestments' }),
          description: intl.formatMessage({ id: 'defaultCategoryInvestmentsDescription' }),
          color: '#FFD54F',
          icon: 'IconTrendingUp',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryDonations' }),
          description: intl.formatMessage({ id: 'defaultCategoryDonationsDescription' }),
          color: '#81C784',
          icon: 'IconHeart',
          createdTimestamp: Date.now(),
          updatedTimestamp: Date.now(),
        },
        {
          id: uuidv4(),
          name: intl.formatMessage({ id: 'defaultCategoryOther' }),
          description: intl.formatMessage({ id: 'defaultCategoryOtherDescription' }),
          color: '#D1C4E9',
          icon: 'IconBox',
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
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      opened={opened}
      onClose={close}
      withCloseButton={false}
    >
      <Title
        order={2}
        size="h1"
        fw={900}
        ta="center"
        mb="md"
      >
        {intl.formatMessage({ id: 'welcome' })}
      </Title>

      <Text size="lg" mb="lg" fw={500}>{intl.formatMessage({ id: 'welcomeDescription' })}</Text>

      <SelectCurrency />
      <SelectLanguage />

      <Checkbox
        mt="md"
        label={intl.formatMessage({ id: 'defaultCategories' })}
        checked={checkedCategories}
        onChange={event => setCheckedCategories(event.currentTarget.checked)}
      />

      <Checkbox
        mt="md"
        label={(
          <>
            {intl.formatMessage({ id: 'termsAgree' })}
            {' '}
            <Anchor href="/terms" target="_blank" inherit>
              {intl.formatMessage({ id: 'termsTitle' })}
            </Anchor>
          </>
        )}
        onChange={event => setCheckedTerms(event.currentTarget.checked)}
      />

      <Group justify="center" mt="xl">
        <Button disabled={!checkedTerms} onClick={handleComplete} type="submit" size="md">
          {intl.formatMessage({ id: 'complete' })}
        </Button>
      </Group>
    </Modal>
  )
}

export default WelcomeModal
