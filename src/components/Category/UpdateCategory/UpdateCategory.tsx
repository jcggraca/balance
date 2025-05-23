import type { FC } from 'react'
import type { Category } from '../../../db'
import type { CategoryForm } from '../../../utils/interfaces'
import { Avatar, Button, ColorInput, Flex, Group, Paper, Text, Textarea, TextInput, UnstyledButton } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconDice } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { db } from '../../../db'
import { colorSchema, descriptionSchema, iconSchema, nameSchema } from '../../../schema/form'
import { displayNotification } from '../../../utils/form'
import IconRenderer from '../../IconRenderer'
import iconsMap from '../../IconRenderer/iconsMap'
import classes from './UpdateCategory.module.css'

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
      icon: category?.icon as keyof typeof iconsMap || 'IconShoppingCart',
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
          icon: values.icon as keyof typeof iconsMap,
          createdTimestamp: date,
          updatedTimestamp: date,
        }
        await db.categories.add(dataNew)
      }
      else {
        if (!category?.id) {
          throw new Error('missingCategoryID')
        }

        const dataUpdate: Category = {
          ...category,
          ...values,
          icon: values.icon as keyof typeof iconsMap,
          name: values.name.trim(),
          description: values.description?.trim(),
          updatedTimestamp: date,
        }
        await db.categories.put(dataUpdate)
      }

      const message = isCreating ? 'categoryAddedSuccessfully' : 'categoryUpdatedSuccessfully'
      displayNotification(intl, 'success', message, 'green')

      form.reset()
      onClose()
    }
    catch (error) {
      const title = intl.formatMessage({ id: 'anErrorOccurred' })
      console.error('UpdateCategory handleSubmit:', error)
      displayNotification(intl, 'error', title, 'red')
    }
  }

  const getRandomColor = () => {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    form.setFieldValue('color', color)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label={intl.formatMessage({ id: 'name' })}
        placeholder={intl.formatMessage({ id: 'enterName' })}
        required
        mt="md"
        minLength={2}
        maxLength={32}
        {...form.getInputProps('name')}
      />

      <Flex align="flex-end" gap="lg">
        <ColorInput
          label={intl.formatMessage({ id: 'color' })}
          placeholder={intl.formatMessage({ id: 'enterColor' })}
          required
          mt="md"
          w="100%"
          {...form.getInputProps('color')}
        />
        <Button title={intl.formatMessage({ id: 'randomColor' })} onClick={getRandomColor}>
          <IconDice />
        </Button>
      </Flex>

      <Text mt="md">
        Icons
        <span className={classes.red}> *</span>
      </Text>
      <Paper withBorder className={classes.iconsContainer}>
        {Object.keys(iconsMap).map(iconKey => (
          <UnstyledButton
            onClick={() => form.setFieldValue('icon', iconKey)}
            key={iconKey}
          >
            <Avatar
              variant={form.getValues().icon === iconKey ? 'light' : 'transparent'}
              color={form.getValues().icon === iconKey ? form.getValues().color : ''}
            >
              <IconRenderer icon={iconKey as keyof typeof iconsMap} />
            </Avatar>
          </UnstyledButton>
        ))}
      </Paper>

      <Textarea
        label={intl.formatMessage({ id: 'description' })}
        placeholder={intl.formatMessage({ id: 'enterDescription' })}
        mt="md"
        minLength={2}
        maxLength={350}
        {...form.getInputProps('description')}
      />

      <Group mt="xl">
        <Button type="submit">{intl.formatMessage({ id: isCreating ? 'addCategory' : 'updateCategory' })}</Button>
        <Button variant="outline" onClick={onClose} type="button">
          {intl.formatMessage({ id: 'cancel' })}
        </Button>
      </Group>
    </form>
  )
}

export default UpdateCategory
