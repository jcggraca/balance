import { Button, Container, Group, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { useIntl } from 'react-intl'
import classes from './ErrorNotFound.module.css'
import { Illustration } from './Illustration'

export default function ErrorNotFound() {
  const intl = useIntl()

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{intl.formatMessage({ id: 'notFoundTitle' })}</Title>
          <Text ta="center" c="dimmed" size="lg" className={classes.description}>
            {intl.formatMessage({ id: 'notFoundText' })}
          </Text>
          <Group justify="center">
            <Button variant="subtle" size="md" component={Link} to="/">
              {intl.formatMessage({ id: 'notfoundLink' })}
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  )
}
