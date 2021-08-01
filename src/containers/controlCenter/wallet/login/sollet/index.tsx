import { useDispatch } from 'react-redux'

import { Row, Card, Col, Avatar } from '@senswap/sen-ui'

import SOLLET from 'static/images/sollet.png'
import { RootDispatch } from 'store'
import { connectWallet } from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'
import { SolletWallet } from '../../lib'

const Sollet = () => {
  const dispatch = useDispatch<RootDispatch>()

  const connect = async () => {
    const wallet = new SolletWallet()
    try {
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er) {
      return dispatch(notify({ type: 'error', description: er.message }))
    }
  }

  return (
    <Card
      onClick={connect}
      style={{ cursor: 'pointer' }}
      bordered={false}
      hoverable
    >
      <Row gutter={[16, 16]} justify="center">
        <Col>
          <Avatar size={64} shape="square" src={SOLLET} />
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, textAlign: 'center' }}>Sollet</p>
        </Col>
      </Row>
    </Card>
  )
}

export default Sollet
