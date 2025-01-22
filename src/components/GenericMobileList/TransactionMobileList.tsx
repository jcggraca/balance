import type { Account, Category, Expense, Income } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Avatar, Card, Grid, Text } from '@mantine/core'
import { IconAlertTriangle, IconMoneybag } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useRef } from 'react'
import IconRenderer from '../IconRenderer'
import classes from './GenericMobileList.module.css'

interface ErrorItem {
  displayError: boolean
  item: Income | Expense
  categories?: Category[]
}

interface TransactionMobileListProps {
  data: Income[] | Expense[] | undefined
  onClick: (item: Income | Expense | Account) => void
  emptyMessage: string
  getAccount: (id: string) => boolean
  errorMessage: string
  categories?: Category[]
}

function RenderAvatar({ displayError, item, categories }: ErrorItem) {
  if (displayError) {
    return (
      <Avatar color="red" radius="xl">
        <IconAlertTriangle />
      </Avatar>
    )
  }

  const categoryData = 'category' in item && categories?.find(o => o.id === item?.category)
  const avatarColor = categoryData && categoryData?.color ? categoryData.color : 'green'
  const avatarIcon = categoryData && categoryData?.icon ? <IconRenderer icon={categoryData.icon} /> : <IconMoneybag />

  return (
    <Avatar color={avatarColor} radius="xl">
      {avatarIcon}
    </Avatar>
  )
}

function TransactionMobileList({
  data,
  onClick,
  emptyMessage,
  getAccount,
  errorMessage,
  categories,
}: TransactionMobileListProps) {
  const { currency } = useSettingsStore()
  const lastDay = useRef<number | null>(null)

  if (!data?.length)
    return <Text mt="xl">{emptyMessage}</Text>

  return (
    <div className={classes.container}>
      {data?.map((item, index) => {
        let showDate = false

        if (lastDay.current !== item.actionTimestamp) {
          showDate = true
          lastDay.current = item.actionTimestamp
        }

        const displayError = !getAccount(item.accountId)

        return (
          <span key={index}>
            {showDate && (
              <Text>{dayjs(item.actionTimestamp).format('DD MMM YYYY')}</Text>
            )}
            <Card
              key={index}
              role="button"
              onClick={() => onClick(item)}
              radius="lg"
              mt="xs"
              mb="xs"
              w="100%"
              className={displayError ? classes.cardError : ''}
            >
              <Grid>
                <Grid.Col span="content">
                  <RenderAvatar displayError={displayError} categories={categories} item={item} />
                </Grid.Col>

                <Grid.Col span="auto">
                  <Text className={classes.name}>
                    {item.name}
                  </Text>
                  {displayError && <Text c="red">{errorMessage}</Text>}
                </Grid.Col>

                <Grid.Col span="content">
                  <Text>
                    {currency}
                    {item.amount}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>
          </span>
        )
      })}
    </div>
  )
}

export default TransactionMobileList
