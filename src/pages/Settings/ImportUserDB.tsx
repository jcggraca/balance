import { Button, FileInput, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import Dexie from 'dexie'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../db'
import { decrypt } from '../../utils/crypto'
import { displayNotification } from '../../utils/form'

export default function ImportUserDB() {
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
      <Button disabled={!form.getValues().file} type="submit" loading={isLoading}>
        {intl.formatMessage({ id: 'importFile' })}
      </Button>
    </form>
  )
}
