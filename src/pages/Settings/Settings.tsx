import type { FC } from 'react'
import { db } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { decrypt, encrypt } from '@/utils/crypto'
import { Button, FileInput, Flex, Paper, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useField, useForm } from '@mantine/form'
import Dexie from 'dexie'
import { exportDB } from 'dexie-export-import'
import { useState } from 'react'

function ImportUserDB() {
  const form = useForm({
    initialValues: {
      password: '',
      file: null as File | null,
    },
    validate: {
      file: value => (!value ? 'File is required' : null),
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
        file: `Import failed. Please check your file and password if encrypted.`,
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(importDB)}>
      <Text>Import DataBase</Text>
      <TextInput
        {...form.getInputProps('password')}
        label="Password"
        type="password"
        placeholder="Enter password"
        description="Only for encrypted files"
        mb="md"
      />
      <FileInput
        {...form.getInputProps('file')}
        accept=".json,.encrypted"
        label="Choose file"
        placeholder="Pick a file"
        mb="md"
      />
      <Button
        type="submit"
        loading={isLoading}
        disabled={!form.isValid()}
      >
        Import File
      </Button>
    </form>
  )
}

function ExportUserDB() {
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
      <Text>Export DataBase</Text>
      <TextInput
        {...field.getInputProps()}
        label="Password"
        type="password"
        placeholder="Enter a password"
        mb="md"
      />
      <Button
        type="submit"
        loading={isLoading}
      >
        Export File
      </Button>
    </form>
  )
}

const Settings: FC = () => {
  const { currency, setCurrency } = useSettingsStore()

  return (
    <Stack>
      <Title order={1}>Settings</Title>

      <Paper shadow="xs" p="md" withBorder>
        <Stack>
          <Title order={2} size="h3">Currency</Title>
          <Select
            label="Select currency symbol"
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
          <Title order={2} size="h3">Database Management</Title>
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
          </Flex>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default Settings
