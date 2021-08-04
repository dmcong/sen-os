import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import {
  Row,
  Col,
  Modal,
  Icon,
  Typography,
  Button,
  Card,
} from '@senswap/sen-ui'

import { RootDispatch, RootState } from 'store'
import PDB from 'helpers/pdb'
import { togglePreset } from 'store/ui.reducer'
import { loadApps, updateApps } from 'store/babysitter.reducer'
import { DynamicLogo } from 'helpers/loader'

const PRESET = ['Sen Wallet', 'Sen Swap', 'Sen LP']

const Preset = () => {
  const { address } = useSelector((state: RootState) => state.wallet)
  const { visiblePreset, visibleSync } = useSelector(
    (state: RootState) => state.ui,
  )
  const { visited } = useSelector((state: RootState) => state.babysitter)
  const dispatch = useDispatch<RootDispatch>()

  const db = useMemo(() => {
    if (!account.isAddress(address)) return null
    return new PDB(address).createInstance('senos')
  }, [address])

  const skip = async () => {
    await finish()
  }

  const go = async () => {
    await dispatch(updateApps([PRESET]))
    await finish()
  }

  const finish = async () => {
    await db.setItem('visited', true)
    await dispatch(loadApps())
    await dispatch(togglePreset(false))
  }

  useEffect(() => {
    if (account.isAddress(address))
      (async () => {
        if (visibleSync || visited) return await dispatch(togglePreset(false))
        await dispatch(togglePreset(true))
      })()
  }, [address, visited, visibleSync, dispatch])

  return (
    <Modal
      visible={visiblePreset}
      onCancel={skip}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24} />
        <Col span={24}>
          <Typography.Title level={1} align="center">
            Welcome to Sen!
          </Typography.Title>
          <Typography.Paragraph type="secondary" align="center">
            If this is the first time you're using SenSwap, you can quickly get
            started with a preset.
          </Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            bodyStyle={{ padding: 16, maxHeight: 512, overflow: 'scroll' }}
            hoverable
          >
            <Row gutter={[16, 8]}>
              {PRESET.map((appName, i) => (
                <Col key={i}>
                  <DynamicLogo name={appName} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={24} />
        <Col span={8}>
          <Button type="text" className="contained" onClick={skip} block>
            Skip
          </Button>
        </Col>
        <Col span={16}>
          <Button type="primary" onClick={go} block>
            Let's go
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Preset
