import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ssjs from 'senswapjs'

import { Row, Col, Button, Icon, Card } from 'sen-kit'
import Markdown from 'components/markdown'

import { RootDispatch, RootState } from 'store'
import { installApp, uninstallApp } from 'store/babysitter.reducer'

const Description = ({ appName }: { appName: string }) => {
  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { address } = useSelector((state: RootState) => state.wallet)
  const { apps } = useSelector((state: RootState) => state.babysitter)

  const isInstalled = () => {
    return ssjs.isAddress(address) && apps.flat().includes(appName)
  }

  const toApp = () => {
    const page = apps.findIndex((row) => row.includes(appName))
    return history.push(`/home?page=${page}&appName=${appName}`)
  }

  return (
    <Row gutter={[16, 16]} justify="space-between">
      <Col>
        {isInstalled() ? (
          <Button type="primary" onClick={toApp}>
            Open
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<Icon name="cloud-download-outline" />}
            onClick={() => dispatch(installApp(appName))}
          >
            Install
          </Button>
        )}
      </Col>
      <Col>
        {isInstalled() ? (
          <Button
            type="text"
            className="contained"
            icon={<Icon name="trash-outline" />}
            onClick={() => dispatch(uninstallApp(appName))}
          >
            Uninstall
          </Button>
        ) : null}
      </Col>
      <Col span={24}>
        <Card className="shadowed">
          <Markdown appName={appName} />
        </Card>
      </Col>
    </Row>
  )
}

export default Description
