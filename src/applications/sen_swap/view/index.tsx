import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Typography, Button, Icon } from '@senswap/sen-ui'
import PoolWatcher from './poolWatcher'

import { getPools } from '../controller/pool.controller'
import { AppDispatch, AppState } from '../model'
import { useSenOs } from 'helpers/senos'

const View = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { time } = useSelector((state: AppState) => state.main)
  const {
    senos: { notify },
  } = useSenOs()

  const onClick = async () => {
    try {
      await dispatch(getPools()).unwrap()
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={1}>Template</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text>
          Updated at: {new Date(time).toString()}
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onClick}
          icon={<Icon name="reload-outline" />}
          block
        >
          Update
        </Button>
      </Col>
      <PoolWatcher />
    </Row>
  )
}

export default View
