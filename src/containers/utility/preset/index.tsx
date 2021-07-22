import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ssjs from 'senswapjs'

import { Row, Col, Modal, Icon, Typography, Button } from 'sen-kit'
import Intro from './intro'

import { RootDispatch, RootState } from 'store'
import PDB from 'helpers/pdb'
import { togglePreset } from 'store/ui.reducer'
import { updateApps } from 'store/babysitter.reducer'
import PRESETS from './presets.json'

const Preset = () => {
  const [presetIndex, setPresetIndex] = useState(0)
  const { address } = useSelector((state: RootState) => state.wallet)
  const { visiblePreset, visibleSync } = useSelector(
    (state: RootState) => state.ui,
  )
  const { visited } = useSelector((state: RootState) => state.babysitter)
  const dispatch = useDispatch<RootDispatch>()

  const db = useMemo(() => {
    if (!ssjs.isAddress(address)) return null
    return new PDB(address).createInstance('senos')
  }, [address])

  const skip = async () => {
    await db.setItem('visited', true)
    await dispatch(togglePreset(false))
  }

  const go = async () => {
    const { preset } = PRESETS[presetIndex]
    await db.setItem('visited', true)
    await dispatch(updateApps([preset]))
    await dispatch(togglePreset(false))
  }

  const choose = async (index: number) => {
    if (index === presetIndex) return setPresetIndex(-1)
    return setPresetIndex(index)
  }

  useEffect(() => {
    if (ssjs.isAddress(address))
      (async () => {
        if (visibleSync || visited) return await dispatch(togglePreset(false))
        await dispatch(togglePreset(true))
      })()
  }, [address, visited, visibleSync, dispatch])

  return (
    <Modal
      visible={visiblePreset}
      onCancel={() => dispatch(togglePreset(false))}
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
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} style={{ maxHeight: 512, overflow: 'scroll' }}>
            {PRESETS.map(({ type, description, preset }, index) => (
              <Col span={24} key={index}>
                <Intro
                  type={type}
                  description={description}
                  preset={preset}
                  selected={index === presetIndex}
                  onClick={() => choose(index)}
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={12}>
          <Button type="text" className="contained" onClick={skip} block>
            Skip
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={go} disabled={presetIndex < 0} block>
            Let's go
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Preset
