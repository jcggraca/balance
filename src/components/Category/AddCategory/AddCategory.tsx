import type { FC } from 'react'
import RenderIcon from '@/components/RenderIcon'
import { type Category, db } from '@/db'
import { Button, ColorInput, Flex, Group, Modal, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'

const AddCategory: FC = () => {
  const intl = useIntl()
  const isMobile = useMediaQuery('(max-width: 48em)')
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      color: '#0055ff',
      icon: 'shopping-cart',
    },
    validate: {
      name: value => (!value.trim() ? intl.formatMessage({ id: 'nameIsRequired' }) : null),
      description: value => (!value.trim() ? intl.formatMessage({ id: 'descriptionIsRequired' }) : null),
      color: value => (!value.trim() ? intl.formatMessage({ id: 'colorIsRequired' }) : null),
      icon: value => (!value.trim() ? intl.formatMessage({ id: 'iconIsRequired' }) : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    const date = dayjs().valueOf()

    const category: Category = {
      ...values,
      id: uuidv4(),
      createdTimestamp: date,
      updatedTimestamp: date,
    }

    await db.categories.add(category)
    form.reset()
    close()
  }

  const RenderAddButton = () => {
    if (isMobile) {
      return (
        <Button className="mobileAddButton" onClick={open}>
          <IconPlus />
        </Button>
      )
    }
    else {
      return <Button onClick={open}>{intl.formatMessage({ id: 'addCategory' })}</Button>
    }
  }

  return (
    <>
      <RenderAddButton />

      <Modal centered opened={opened} onClose={close} title={intl.formatMessage({ id: 'addCategory' })}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label={intl.formatMessage({ id: 'name' })}
            placeholder={intl.formatMessage({ id: 'enterName' })}
            required
            mt="md"
            {...form.getInputProps('name')}
          />

          <ColorInput
            label={intl.formatMessage({ id: 'color' })}
            placeholder={intl.formatMessage({ id: 'enterColor' })}
            required
            mt="md"
            {...form.getInputProps('color')}
          />

          <Flex align="center">
            <TextInput
              label={intl.formatMessage({ id: 'icon' })}
              placeholder={intl.formatMessage({ id: 'enterIcon' })}
              required
              value={form.values.icon}
              w="100%"
              mt="md"
              {...form.getInputProps('icon')}
            />
            <RenderIcon icon={form.values.icon} />
          </Flex>
          <a href="https://tabler.io/icons" target="_blank" rel="noreferrer">
            {intl.formatMessage({ id: 'searchIcon' })}
          </a>

          <Textarea
            label={intl.formatMessage({ id: 'description' })}
            placeholder={intl.formatMessage({ id: 'enterDescription' })}
            required
            mt="md"
            {...form.getInputProps('description')}
          />

          <Group mt="xl">
            <Button type="submit">{intl.formatMessage({ id: 'addCategory' })}</Button>
            <Button onClick={close} type="button">
              {intl.formatMessage({ id: 'cancel' })}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}

export default AddCategory
