import type { FC } from 'react'
import SelectCurrency from '@/components/SelectCurrency'
import SelectLanguage from '@/components/SelectLanguage'
import { db } from '@/db'
import { decrypt, encrypt } from '@/utils/crypto'
import { displayNotification } from '@/utils/form'
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

      // TODO: Get better solution for import
      // const importObject: ExpenseData = JSON.parse(data)
      // const tables = ['account', 'expenses', 'categories', 'budget', 'income', 'debts']
      // const filteredData = await Promise.all(tables.map(async (table) => {
      //   const importTable = importObject.data.data
      //   const importTableIndex = importTable.findIndex(o => o.tableName === table)
      //   const currentTable = await db[table].toArray()

      //   let newRows

      //   if (importTable?.[importTableIndex]?.rows && currentTable) {
      //     newRows = importTable[importTableIndex].rows.map((item) => {
      //       const findCurrentDuplicated = currentTable.find(o => o.id === item.id)
      //       if (findCurrentDuplicated) {
      //         if (findCurrentDuplicated.updatedTimestamp > item.updatedTimestamp) {
      //           // TODO: Ask the user with data he want to save
      //           return findCurrentDuplicated
      //         } else if (findCurrentDuplicated.updatedTimestamp > item.updatedTimestamp) {
      //           return item
      //         }
      //       }
      //       return item
      //     })
      //   }
      //   else if (!currentTable) {
      //     throw new Error(intl.formatMessage({ id: 'importedError' }))
      //   }
      //   else {
      //     newRows = currentTable
      //   }

      //   const current = importObject.data.data[currentTable]
      //   return {
      //     ...current,
      //     rows: newRows,
      //   }
      // }))
      // console.log({
      //   ...importObject,
      //   data: {
      //     ...importObject.data,
      //     data: filteredData,
      //   },
      // })

      await db.delete()
      const blob = new Blob([data], { type: 'application/json' })
      await Dexie.import(blob)
      window.location.reload()

      displayNotification(intl, 'success', 'importedSuccessfully', 'green')
    }
    catch (error: any) {
      console.error(error)
      form.setErrors({ file: intl.formatMessage({ id: 'importedError' }) })
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

      displayNotification(intl, 'success', 'exportedSuccessfully', 'green')
    }
    catch (error: any) {
      const message = error.message || 'exportedError'
      displayNotification(intl, 'success', message, 'red')
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
