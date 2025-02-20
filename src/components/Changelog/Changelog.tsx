import { Flex, List, Modal, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useAlertsStore } from '../../stores/useAlertsStore'
import styles from './Changelog.module.css'

interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

const Changelog: React.FC = () => {
  const { showChangelog, setShowChangelog } = useAlertsStore()
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([])

  useEffect(() => {
    fetch('/changelog.json')
      .then(res => res.json())
      .then(data => setChangelog(data))
  }, [])

  return (
    <Modal
      opened={showChangelog}
      onClose={() => setShowChangelog(false)}
      centered
      title="Changelog"
    >
      {changelog.map((entry, index) => (
        <div key={index}>
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
            {entry.changes.map((change, idx) => (
              <List.Item className={styles.listItem} key={idx}>
                {change}
              </List.Item>
            ))}
          </List>
        </div>
      ))}
    </Modal>
  )
}

export default Changelog
