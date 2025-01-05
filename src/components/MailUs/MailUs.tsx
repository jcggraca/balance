import { supabase } from '@/API/client'
import { Button, Checkbox, Group, Modal, Select, SimpleGrid, Textarea, TextInput, Title, Tooltip, UnstyledButton } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconMail } from '@tabler/icons-react'
import { useState } from 'react'
import classes from './MailUs.module.css'

function MailUs() {
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
        title: 'Success',
        message: 'Your message has been sent successfully!',
        color: 'green',
      })

      form.reset()
      close()
    }
    catch (error) {
      console.error('Error sending message:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to send message. Please try again.',
        color: 'red',
      })
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Tooltip label="Email us" position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={open}
          className={classes.button}
          aria-label="Email us"
        >
          <IconMail />
        </UnstyledButton>
      </Tooltip>

      <Modal centered opened={opened} onClose={close} title="">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title
            order={2}
            size="h1"
            fw={900}
            ta="center"
          >
            Get in touch
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
            <TextInput
              label="Name"
              placeholder="Your name"
              name="name"
              variant="filled"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              name="email"
              variant="filled"
              required
              {...form.getInputProps('email')}
            />
          </SimpleGrid>

          <Select
            label="Type"
            data={['Bug', 'Feature request', 'Other']}
            placeholder="Select a topic"
            name="type"
            variant="filled"
            mt="md"
            required
            {...form.getInputProps('type')}
          />

          <TextInput
            label="Subject"
            placeholder="Subject"
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps('subject')}
          />

          <Textarea
            mt="md"
            label="Message"
            placeholder="Your message"
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
                I accept the
                {' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  terms of service
                </a>
                {' '}
                and
                {' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  privacy policy
                </a>
              </>
            )}
            required
            {...form.getInputProps('accepted_tos', { type: 'checkbox' })}
          />

          <Group justify="center" mt="xl">
            <Button type="submit" size="md" loading={loading}>
              Send message
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default MailUs
