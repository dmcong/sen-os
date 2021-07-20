import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ssjs from 'senswapjs'

import { Row, Col, Button, Icon, Card } from 'sen-kit'
import Markdown from 'components/markdown'

import PDB from 'helpers/pdb'
import { RootDispatch, RootState } from 'store'
import { updateApps } from 'store/babysitter.reducer'

const Description = ({ appName }: { appName: string }) => {
  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { address } = useSelector((state: RootState) => state.wallet)
  const { apps } = useSelector((state: RootState) => state.babysitter)

  const isInstalled = () => {
    return ssjs.isAddress(address) && apps.flat().includes(appName)
  }

  const installApp = async () => {
    if (isInstalled()) return
    const newApps = apps.map((page) => [...page])
    newApps[newApps.length - 1].push(appName)
    return await dispatch(updateApps(newApps))
  }

  const uninstallApp = async () => {
    const pdb = new PDB(address)
    if (!isInstalled()) return
    const newApps = apps.map((page) => page.filter((name) => name !== appName))
    await dispatch(updateApps(newApps))
    return await pdb.dropInstance(appName)
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
            onClick={installApp}
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
            onClick={uninstallApp}
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
