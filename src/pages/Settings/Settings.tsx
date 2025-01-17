import type { FC } from 'react'
import SelectCurrency from '@/components/SelectCurrency'
import SelectLanguage from '@/components/SelectLanguage'
import { db } from '@/db'
import { decrypt, encrypt } from '@/utils/crypto'
import { Button, Divider, FileInput, Group, Modal, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { useField, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import Dexie from 'dexie'
import { exportDB } from 'dexie-export-import'
import { useState } from 'react'
import { useIntl } from 'react-intl'

function ImportUserDB() {
  const intl = useIntl()

  const form = useForm({
    initialValues: {
      password: '',
      file: null as File | null,
    },
    validate: {
      file: value => (!value ? intl.formatMessage({ id: 'fileIsRequired' }) : null),
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const importDB = async () => {
    if (!form.isValid())
      return

    const { password, file } = form.values
    if (!file)
      return

    // onToggle()

    try {
      setIsLoading(true)

      const fileBuffer = await file.arrayBuffer()
      const isEncrypted = file.name.endsWith('.encrypted')
      let data

      if (isEncrypted) {
        if (!password) {
          notifications.show({
            title: intl.formatMessage({ id: 'error' }),
            message: intl.formatMessage({ id: 'passwordRequiredForDecryption' }),
            color: 'red',
          })
          form.setErrors({
            password: intl.formatMessage({ id: 'passwordRequiredForDecryption' }),
          })
          return
        }

        try {
          data = await decrypt(fileBuffer, password)
        }
        catch (error) {
          console.error('import error', error)
          notifications.show({
            title: intl.formatMessage({ id: 'error' }),
            message: intl.formatMessage({ id: 'wrongPassword' }),
            color: 'red',
          })
          return
        }
      }
      else {
        const textDecoder = new TextDecoder()
        const jsonString = textDecoder.decode(fileBuffer)
        data = jsonString
      }

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
    catch (error) {
      console.error('Import failed:', error)
      form.setErrors({
        file: intl.formatMessage({ id: 'importedError' }),
      })
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error instanceof Error ? error.message : intl.formatMessage({ id: 'importedError' }),
        color: 'red',
      })
    }
    finally {
      // onToggle()
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(importDB)}>
      <Title mb="xs" order={4}>{intl.formatMessage({ id: 'importFile' })}</Title>
      <Text>{intl.formatMessage({ id: 'cleanBeforeDB' })}</Text>
      <TextInput
        {...form.getInputProps('password')}
        label={intl.formatMessage({ id: 'password' })}
        type="password"
        placeholder={intl.formatMessage({ id: 'enterPassword' })}
        description={intl.formatMessage({ id: 'requiredForEncryptedFiles' })}
        mb="md"
      />
      <FileInput
        {...form.getInputProps('file')}
        accept=".json,.encrypted"
        label={intl.formatMessage({ id: 'chooseFile' })}
        placeholder={intl.formatMessage({ id: 'pickFile' })}
        mb="md"
      />
      <Button
        type="submit"
        loading={isLoading}
        disabled={!form.isValid()}
      >
        {intl.formatMessage({ id: 'importFile' })}
      </Button>
    </form>
  )
}

function ExportUserDB() {
  const intl = useIntl()

  const field = useField({
    initialValue: '',
    validate: value => (value.trim().length < 2 ? 'Value is too short' : null),
  })
  const [isLoading, setIsLoading] = useState(false)

  const exportLocalDB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const password = field.getValue()
    // onToggle()

    try {
      setIsLoading(true)

      const blob = await exportDB(db)
      const arrayBuffer = await blob.arrayBuffer()
      const encryptedData = await encrypt(arrayBuffer, password)
      const fileURL = URL.createObjectURL(new Blob([password ? encryptedData : arrayBuffer]))
      const downloadLink = document.createElement('a')
      downloadLink.href = fileURL
      downloadLink.download = `db.${password ? 'encrypted' : 'json'}`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      URL.revokeObjectURL(fileURL)

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: 'exportedSuccessfully' }),
        color: 'green',
      })
    }
    catch (error) {
      console.error('Export failed:', error)
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error instanceof Error ? error.message : intl.formatMessage({ id: 'exportedError' }),
        color: 'red',
      })
    }
    finally {
      // onToggle()
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <form onSubmit={exportLocalDB}>
      <Title mb="xs" order={4}>{intl.formatMessage({ id: 'exportDatabase' })}</Title>
      <TextInput
        {...field.getInputProps()}
        label={`${intl.formatMessage({ id: 'password' })} (${intl.formatMessage({ id: 'recommended' })})`}
        type="password"
        placeholder={intl.formatMessage({ id: 'enterPassword' })}
        description={intl.formatMessage({ id: 'recommendedForSecurity' })}
        mb="md"
      />
      <Button
        type="submit"
        loading={isLoading}
      >
        {intl.formatMessage({ id: 'exportFile' })}
      </Button>
    </form>
  )
}

const Settings: FC = () => {
  const intl = useIntl()
  // const [visible, { toggle }] = useDisclosure(false)
  const [opened, { open, close }] = useDisclosure(false)

  const handleDelete = async () => {
    try {
      // toggle()
      localStorage.clear()
      await db.delete()
      history.pushState(null, '', '/')
      // toggle()
      location.reload()
    }
    catch (error) {
      console.error('Failed to delete user data:', error)
    }
    // finally {
    //   toggle()
    // }
  }

  const handleExportCSV = async () => {
    try {
      const tables = db.tables
      let csvContent = ''

      for (const table of tables) {
        csvContent += `Table: ${table.name}\n`
        const records = await table.toArray()

        if (records.length > 0) {
          const keys = Object.keys(records[0])
          csvContent += `${keys.join(',')}\n`

          records.forEach((record) => {
            const values = keys.map(key => JSON.stringify(record[key] ?? ''))
            csvContent += `${values.join(',')}\n`
          })
        }
        else {
          csvContent += 'No data\n'
        }

        csvContent += '\n'
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = 'database_export.csv'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    catch (error) {
      console.error('Failed to export CSV:', error)
    }
  }

  return (
    <Stack>
      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'deleteAllData' })}>
        <Text>
          {intl.formatMessage({ id: 'confirmDeleteDB' })}
          ?
        </Text>

        <Text c="red" mt="md" fw="bold">
          {intl.formatMessage({ id: 'isIrreversible' })}
          !
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

      {/* <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} /> */}

      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>{intl.formatMessage({ id: 'currency' })}</Title>
          <SelectCurrency />
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>{intl.formatMessage({ id: 'language' })}</Title>
          <SelectLanguage />
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={3}>{intl.formatMessage({ id: 'databaseManagement' })}</Title>

        <ImportUserDB />
        <Divider my="md" />
        <ExportUserDB />
        <Divider my="md" />
        <Title order={4}>{intl.formatMessage({ id: 'exportCSV' })}</Title>
        <Text mt="lg" mb="xs">{intl.formatMessage({ id: 'noImportCSV' })}</Text>
        <Button
          onClick={handleExportCSV}
        >
          {intl.formatMessage({ id: 'export' })}
        </Button>
        <Divider my="md" />
        <Title order={4}>{intl.formatMessage({ id: 'delete' })}</Title>
        <Text mt="lg" mb="xs">{intl.formatMessage({ id: 'deleteAllData' })}</Text>
        <Button
          color="red"
          onClick={open}
        >
          {intl.formatMessage({ id: 'delete' })}
        </Button>
      </Paper>
    </Stack>
  )
}

export default Settings
