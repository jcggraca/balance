import { supabase } from '@/API/client'
import { Button, Checkbox, Group, Modal, Select, SimpleGrid, Textarea, TextInput, Title, Tooltip, UnstyledButton } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconMail } from '@tabler/icons-react'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import classes from './MailUs.module.css'

interface MailUsProps {
  isMobile: boolean
}

function MailUs({ isMobile }: MailUsProps) {
  const intl = useIntl()
  const [opened, { open, close }] = useDisclosure(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      type: '',
      subject: '',
      message: '',
      accepted_tos: false,
    },
    validate: {
      name: value => value.trim().length < 2,
      email: value => !/^\S[^\s@]*@\S+$/.test(value),
      subject: value => value.trim().length === 0,
      accepted_tos: value => !value,
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([values])

      if (error)
        throw error

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: 'messageSentSuccessfully' }),
        color: 'green',
      })

      form.reset()
      close()
    }
    catch (error) {
      console.error('Error sending message:', error)
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: intl.formatMessage({ id: 'messageSentFailed' }),
        color: 'red',
      })
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isMobile
        ? (
            <UnstyledButton
              onClick={open}
              className={classes.buttonMobile}
              aria-label={intl.formatMessage({ id: 'emailUs' })}
            >
              <IconMail className={classes.buttonMobileIcon} />
              <span>{intl.formatMessage({ id: 'emailUs' })}</span>
            </UnstyledButton>
          )
        : (
            <Tooltip label={intl.formatMessage({ id: 'emailUs' })} position="right" transitionProps={{ duration: 0 }}>
              <UnstyledButton
                onClick={open}
                className={classes.button}
                aria-label={intl.formatMessage({ id: 'emailUs' })}
              >
                <IconMail />
              </UnstyledButton>
            </Tooltip>
          )}

      <Modal centered opened={opened} onClose={close} title="">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title
            order={2}
            size="h1"
            fw={900}
            ta="center"
          >
            {intl.formatMessage({ id: 'getInTouch' })}
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
              label={intl.formatMessage({ id: 'name' })}
              placeholder={intl.formatMessage({ id: 'yourName' })}
              name="name"
              variant="filled"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label={intl.formatMessage({ id: 'email' })}
              placeholder={intl.formatMessage({ id: 'yourEmail' })}
              name="email"
              variant="filled"
              required
              {...form.getInputProps('email')}
            />
          </SimpleGrid>

          <Select
            label={intl.formatMessage({ id: 'type' })}
            data={['Bug', 'Feature request', 'Other']}
            placeholder={intl.formatMessage({ id: 'selectATopic' })}
            name="type"
            variant="filled"
            mt="md"
            required
            {...form.getInputProps('type')}
          />

          <TextInput
            label={intl.formatMessage({ id: 'subject' })}
            placeholder={intl.formatMessage({ id: 'subject' })}
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps('subject')}
          />

          <Textarea
            mt="md"
            label={intl.formatMessage({ id: 'message' })}
            placeholder={intl.formatMessage({ id: 'yourMessage' })}
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps('message')}
          />

          <Checkbox
            mt="md"
            label={(
              <>
                {intl.formatMessage({ id: 'iAcceptThe' })}
                {' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  {intl.formatMessage({ id: 'termsOfService' })}
                </a>
                {' '}
                {intl.formatMessage({ id: 'and' })}
                {' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  {intl.formatMessage({ id: 'privacyPolicy' })}
                </a>
              </>
            )}
            required
            {...form.getInputProps('accepted_tos', { type: 'checkbox' })}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md" loading={loading}>
              {intl.formatMessage({ id: 'sendMessage' })}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default MailUs
