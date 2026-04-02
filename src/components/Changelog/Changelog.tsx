import { Flex, List, Modal, Text } from '@mantine/core'
import useSWR from 'swr'
import { useAlertsStore } from '../../stores/useAlertsStore'
import styles from './Changelog.module.css'

interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

const fetcher = (url: string): Promise<ChangelogEntry[]> => fetch(url).then(res => res.json())

export default function Changelog() {
  const { showChangelog, setShowChangelog } = useAlertsStore()

  const { data: changelog = [] } = useSWR('/changelog.json', fetcher)

  return (
    <Modal
      opened={showChangelog}
      onClose={() => setShowChangelog(false)}
      centered
      title="Changelog"
    >
      {changelog.map(entry => (
        <div key={entry.version}>
          <Flex className={styles.header}>
            <Text size="md">
              Version
              {' '}
              {entry.version}
            </Text>
            <Text size="sm">
              {entry.date}
            </Text>
          </Flex>

          <List mb="md">
            {entry.changes.map(change => (
              <List.Item className={styles.listItem} key={change}>
                {change}
              </List.Item>
            ))}
          </List>
        </div>
      ))}
    </Modal>
  )
}
