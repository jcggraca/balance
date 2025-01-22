import type { FC } from 'react'
import SelectCurrency from '@/components/SelectCurrency'
import SelectLanguage from '@/components/SelectLanguage'
import { db } from '@/db'
import { decrypt, encrypt } from '@/utils/crypto'
import {
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import Dexie from 'dexie'
import { exportDB } from 'dexie-export-import'
import { useState } from 'react'
import { useIntl } from 'react-intl'

const ImportUserDB: FC = () => {
  const intl = useIntl()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: {
      password: '',
      file: null as File | null,
    },
    validate: {
      file: value =>
        value ? null : intl.formatMessage({ id: 'fileIsRequired' }),
    },
  })

  const handleImport = async () => {
    if (!form.isValid())
      return

    const { password, file } = form.values
    if (!file)
      return

    try {
      setIsLoading(true)

      const fileBuffer = await file.arrayBuffer()
      const isEncrypted = file.name.endsWith('.encrypted')
      let data

      if (isEncrypted) {
        if (!password) {
          form.setErrors({
            password: intl.formatMessage({
              id: 'passwordRequiredForDecryption',
            }),
          })
          notifications.show({
            title: intl.formatMessage({ id: 'error' }),
            message: intl.formatMessage({
              id: 'passwordRequiredForDecryption',
            }),
            color: 'red',
          })
          return
        }
        data = await decrypt(fileBuffer, password).catch(() => {
          throw new Error(intl.formatMessage({ id: 'wrongPassword' }))
        })
      }
      else {
        const textDecoder = new TextDecoder()
        data = textDecoder.decode(fileBuffer)
      }

      // Replace the current database
      await db.delete()
      const blob = new Blob([data], { type: 'application/json' })
      await Dexie.import(blob)
      window.location.reload()

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: 'importedSuccessfully' }),
        color: 'green',
      })
    }
    catch (error: any) {
      form.setErrors({
        file: error.message || intl.formatMessage({ id: 'importedError' }),
      })
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error.message || intl.formatMessage({ id: 'importedError' }),
        color: 'red',
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleImport)}>
      <Title order={4}>{intl.formatMessage({ id: 'importFile' })}</Title>
      <Text>{intl.formatMessage({ id: 'cleanBeforeDB' })}</Text>
      <TextInput
        {...form.getInputProps('password')}
        label={intl.formatMessage({ id: 'password' })}
        type="password"
        placeholder={intl.formatMessage({ id: 'enterPassword' })}
        description={intl.formatMessage({ id: 'requiredForEncryptedFiles' })}
      />
      <FileInput
        {...form.getInputProps('file')}
        accept=".json,.encrypted"
        label={intl.formatMessage({ id: 'chooseFile' })}
        placeholder={intl.formatMessage({ id: 'pickFile' })}
        mb="md"
      />
      <Button type="submit" loading={isLoading}>
        {intl.formatMessage({ id: 'importFile' })}
      </Button>
    </form>
  )
}

const ExportUserDB: FC = () => {
  const intl = useIntl()

  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)

      const blob = await exportDB(db)
      const arrayBuffer = await blob.arrayBuffer()
      const encryptedData = password
        ? await encrypt(arrayBuffer, password)
        : arrayBuffer

      const fileName = `db.${password ? 'encrypted' : 'json'}`
      const fileURL = URL.createObjectURL(new Blob([encryptedData]))
      const downloadLink = document.createElement('a')
      downloadLink.href = fileURL
      downloadLink.download = fileName
      downloadLink.click()
      URL.revokeObjectURL(fileURL)

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: 'exportedSuccessfully' }),
        color: 'green',
      })
    }
    catch (error: any) {
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error.message || intl.formatMessage({ id: 'exportedError' }),
        color: 'red',
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Title order={4}>{intl.formatMessage({ id: 'exportDatabase' })}</Title>
      <TextInput
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
        label={`${intl.formatMessage({ id: 'password' })} (${intl.formatMessage({
          id: 'recommended',
        })})`}
        type="password"
        placeholder={intl.formatMessage({ id: 'enterPassword' })}
        description={intl.formatMessage({ id: 'recommendedForSecurity' })}
        mb="md"
      />
      <Button onClick={handleExport} loading={isLoading}>
        {intl.formatMessage({ id: 'exportFile' })}
      </Button>
    </form>
  )
}

const Settings: FC = () => {
  const intl = useIntl()

  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    try {
      localStorage.clear()
      await db.delete()
      location.reload()
    }
    catch (error) {
      console.error('Failed to delete user data:', error)
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
    </Stack>
  )
}

export default Settings
