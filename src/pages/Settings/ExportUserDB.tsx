import { Button, TextInput, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { exportDB } from 'dexie-export-import'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { db } from '../../db'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { encrypt } from '../../utils/crypto'
import { displayNotification } from '../../utils/form'
import { getCurrentDateString } from '../../utils/utils'

export default function ExportUserDB() {
  const intl = useIntl()
  const { setLastBackup } = useSettingsStore()

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
      const date = getCurrentDateString()

      const fileName = `db-${date}.${password ? 'encrypted' : 'json'}`
      const fileURL = URL.createObjectURL(new Blob([encryptedData]))
      const downloadLink = document.createElement('a')
      downloadLink.href = fileURL
      downloadLink.download = fileName
      downloadLink.click()
      URL.revokeObjectURL(fileURL)

      displayNotification(intl, 'success', 'exportedSuccessfully', 'green')
      setLastBackup(dayjs().valueOf())
    }
    catch (error: any) {
      const message = error.message || 'exportedError'
      displayNotification(intl, 'error', message, 'red')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
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
    </>
  )
}
