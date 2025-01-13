import type { FC } from 'react'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { decrypt, encrypt } from '@/utils/crypto'
import { Button, FileInput, Flex, Paper, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useField, useForm } from '@mantine/form'
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

    try {
      setIsLoading(true)
      const fileBuffer = await file.arrayBuffer()
      const isEncrypted = file.name.endsWith('.encrypted')
      let data
      if (isEncrypted && password) {
        data = await decrypt(fileBuffer, password)
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
    }
    catch (error) {
      console.error('Import failed:', error)
      form.setErrors({
        file: intl.formatMessage({ id: 'importFailed' }),
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(importDB)}>
      <Text>{intl.formatMessage({ id: 'importFile' })}</Text>
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
    }
    catch (error) {
      console.error('Export failed:', error)
    }
    finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <form onSubmit={exportLocalDB}>
      <Text>{intl.formatMessage({ id: 'exportDatabase' })}</Text>
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
  const { currency, setCurrency, language, setLanguage } = useSettingsStore()
  const intl = useIntl()

  const handleDelete = async () => {
    try {
      await db.delete()
      localStorage.clear()
    }
    catch (error) {
      console.error('Failed to delete user data:', error)
    }
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
      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={2} size="h3">{intl.formatMessage({ id: 'currency' })}</Title>
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
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={2} size="h3">{intl.formatMessage({ id: 'language' })}</Title>
          <Select
            label={intl.formatMessage({ id: 'selectLanguage' })}
            value={language}
            onChange={value => setLanguage(value || 'en')}
            data={[
              { value: 'en', label: intl.formatMessage({ id: 'english' }) },
              { value: 'pt', label: intl.formatMessage({ id: 'portuguese' }) },
            ]}
          />
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={3}>{intl.formatMessage({ id: 'databaseManagement' })}</Title>
          <Text></Text>
          <Flex
            gap="md"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Paper withBorder p="md" style={{ flex: 1 }}>
              <ImportUserDB />
            </Paper>
            <Paper withBorder p="md" style={{ flex: 1 }}>
              <ExportUserDB />
            </Paper>
            <Paper withBorder p="md" style={{ flex: 1 }}>
              <Title order={3}>{intl.formatMessage({ id: 'exportCSV' })}</Title>
              <Button
                onClick={handleExportCSV}
              >
                {intl.formatMessage({ id: 'export' })}
              </Button>
            </Paper>
            <Paper withBorder p="md" style={{ flex: 1 }}>
              <Title order={3}>{intl.formatMessage({ id: 'deleteUserData' })}</Title>
              <Button
                color="red"
                onClick={handleDelete}
              >
                {intl.formatMessage({ id: 'delete' })}
              </Button>
            </Paper>
          </Flex>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default Settings
