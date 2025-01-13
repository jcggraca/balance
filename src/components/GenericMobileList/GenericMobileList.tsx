import type { Account, Budget, Category, Debt } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Avatar, Card, Grid, Loader, Text } from '@mantine/core'
import { IconMoneybag } from '@tabler/icons-react'
import RenderIcon from '../RenderIcon'
import classes from './GenericMobileList.module.css'

interface GenericMobileListProps {
  data: Account[] | Budget[] | Debt[] | Category[] | undefined
  onClick: (item: Account | Budget | Debt | Category) => void
  emptyMessage: string
  isLoading?: boolean
}

interface ErrorItem {
  item: Category
}

function RenderAvatar({ item }: ErrorItem) {
  const avatarColor = item?.color ? item.color : 'green'
  const avatarIcon = item?.icon ? <RenderIcon noStyle icon={item.icon} /> : <IconMoneybag />

  return (
    <Avatar color={avatarColor} radius="xl">
      {avatarIcon}
    </Avatar>
  )
}

function GenericMobileList({
  data,
  onClick,
  isLoading,
  emptyMessage,
}: GenericMobileListProps) {
  const { currency } = useSettingsStore()

  if (isLoading)
    return <Loader color="blue" />

  if (!data?.length)
    return <Text mt="xl">{emptyMessage}</Text>

  return (
    <div className={classes.container}>
      {data.map((item, index) => {
        return (
          <span key={index}>
            <Card
              key={index}
              role="button"
              onClick={() => onClick(item)}
              radius="lg"
              mt="xs"
              mb="xs"
              w="100%"
            >
              <Grid>
                <Grid.Col span="content">
                  <Avatar color="green" radius="xl">
                    {'icon' in item ? <RenderAvatar item={item} /> : <IconMoneybag />}
                  </Avatar>
                </Grid.Col>

                <Grid.Col span="auto">
                  <Text className={classes.name}>
                    {item.name}
                  </Text>
                </Grid.Col>

                {'amount' in item && (
                  <Grid.Col span="content">
                    <Text>
                      {currency}
                      {item.amount}
                    </Text>
                  </Grid.Col>
                )}
              </Grid>
            </Card>
          </span>
        )
      })}
    </div>
  )
}

export default GenericMobileList
