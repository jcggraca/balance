import type { Account, Budget, Category, Debt } from '@/db'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Avatar, Card, Grid, Text } from '@mantine/core'
import { IconMoneybag } from '@tabler/icons-react'
import IconRenderer from '../IconRenderer'
import classes from './GenericMobileList.module.css'

interface GenericMobileListProps {
  data: Account[] | Budget[] | Debt[] | Category[] | undefined
  onClick: (item: Account | Budget | Debt | Category) => void
  emptyMessage: string
}

function GenericMobileList({
  data,
  onClick,
  emptyMessage,
}: GenericMobileListProps) {
  const { currency } = useSettingsStore()

  if (!data?.length)
    return <Text mt="xl">{emptyMessage}</Text>

  return (
    <div className={classes.container}>
      {data?.map((item, index) => {
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
                  {'icon' in item
                    ? (
                        <Avatar color={item?.color ? item.color : 'green'} radius="xl">
                          {item?.icon ? <IconRenderer icon={item.icon} /> : <IconMoneybag />}
                        </Avatar>
                      )
                    : <IconMoneybag />}
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
