import {
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'
import { useIntl } from 'react-intl'
import SelectCurrency from '../../components/SelectCurrency'
import SelectLanguage from '../../components/SelectLanguage'
import { db } from '../../db'
import { displayNotification } from '../../utils/form'
import ExportUserDB from './ExportUserDB'
import ImportUserDB from './ImportUserDB'

export default function Settings() {
  const intl = useIntl()

  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    try {
      localStorage.clear()
      await db.delete()
      location.reload()
    }
    catch (error) {
      const message = intl.formatMessage({ id: 'confirmDeleteDB' })
      console.error('Failed to delete user data:', error)
      displayNotification(intl, 'error', message, 'red')
    }
  }

  return (
    <Stack>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={intl.formatMessage({ id: 'deleteAllData' })}
      >
        <Text>{intl.formatMessage({ id: 'confirmDeleteDB' })}</Text>
        <Text c="red" mt="md" fw="bold">
          {intl.formatMessage({ id: 'isIrreversible' })}
        </Text>
        <Group mt="xl">
          <Button color="red" onClick={handleDelete}>
            {intl.formatMessage({ id: 'confirm' })}
          </Button>
          <Button onClick={close}>
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
        </Group>
      </Modal>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={3}>{intl.formatMessage({ id: 'currency' })}</Title>
        <SelectCurrency />
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={3}>{intl.formatMessage({ id: 'language' })}</Title>
        <SelectLanguage />
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={3}>{intl.formatMessage({ id: 'databaseManagement' })}</Title>
        <ImportUserDB />
        <Divider my="md" />
        <ExportUserDB />
        <Divider my="md" />
        <Title order={4}>{intl.formatMessage({ id: 'delete' })}</Title>
        <Text>{intl.formatMessage({ id: 'deleteAllData' })}</Text>
        <Button color="red" onClick={open} mt="md">
          {intl.formatMessage({ id: 'delete' })}
        </Button>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={3}>{intl.formatMessage({ id: 'privacyPolicyTitle' })}</Title>
        <Text mb="md">{intl.formatMessage({ id: 'privacyPolicyText' })}</Text>

        <Title order={3}>{intl.formatMessage({ id: 'termsTitle' })}</Title>
        <Link to="/terms">
          {intl.formatMessage({ id: 'termsReadLink' })}
        </Link>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Text>Version: 1.1.0</Text>
        <Text>
          Report a bug:
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Github Issues (opens in a new tab)"
            href="https://github.com/jcggraca/balance/issues"
          >
            Github Issues
          </a>
        </Text>
      </Paper>
    </Stack>
  )
}
