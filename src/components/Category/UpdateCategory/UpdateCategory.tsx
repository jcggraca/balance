import type { Category } from '@/db'
import type { CategoryForm } from '@/utils/interfaces'
import type { FC } from 'react'
import RenderIcon from '@/components/RenderIcon'
import { db } from '@/db'
import { colorSchema, descriptionSchema, iconSchema, nameSchema } from '@/schema/form'
import { Button, ColorInput, Flex, Group, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

interface UpdateCategoryProps {
  onClose: () => void
  isCreating?: boolean
  category?: Category
}

const UpdateCategory: FC<UpdateCategoryProps> = ({ onClose, category, isCreating = false }) => {
  const intl = useIntl()

  const schema = z.object({
    name: nameSchema(intl),
    description: descriptionSchema(intl),
    color: colorSchema(intl),
    icon: iconSchema(intl),
  })

  const form = useForm<CategoryForm>({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || '#0055ff',
      icon: category?.icon || 'shopping-cart',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = async (values: CategoryForm) => {
    try {
      const date = dayjs().valueOf()

      if (isCreating) {
        const dataNew: Category = {
          ...values,
          id: uuidv4(),
          name: values.name.trim(),
          description: values.description?.trim(),
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.categories.add(dataNew)
      }
      else {
        if (!category?.id) {
          throw new Error('Category ID is missing')
        }

        const dataUpdate: Category = {
          ...category,
          ...values,
          name: values.name.trim(),
          description: values.description?.trim(),
          updatedTimestamp: date,
        }
        await db.categories.put(dataUpdate)
      }

      notifications.show({
        title: intl.formatMessage({ id: 'success' }),
        message: intl.formatMessage({ id: isCreating ? 'categoryAddedSuccessfully' : 'categoryUpdatedSuccessfully' }),
        color: 'green',
      })

      form.reset()
      onClose()
    }
    catch (error) {
      notifications.show({
        title: intl.formatMessage({ id: 'error' }),
        message: error instanceof Error ? error.message : intl.formatMessage({ id: 'anErrorOccurred' }),
        color: 'red',
      })
    }
  }

  return (
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
        <Button variant="outline" onClick={onClose} type="button">
          {intl.formatMessage({ id: 'cancel' })}
        </Button>
      </Group>
    </form>
  )
}

export default UpdateCategory
