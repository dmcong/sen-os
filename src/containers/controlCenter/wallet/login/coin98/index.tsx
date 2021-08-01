import { useDispatch } from 'react-redux'

import { Row, Card, Col, Avatar } from '@senswap/sen-ui'

import COIN98 from 'static/images/coin98.png'
import { RootDispatch } from 'store'
import { connectWallet } from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'
import { Coin98Wallet } from '../../lib'

declare global {
  interface Window {
    coin98: any
  }
}

const Coin98 = () => {
  const dispatch = useDispatch<RootDispatch>()

  const connect = async () => {
    const { coin98 } = window
    if (!coin98)
      return dispatch(
        notify({
          type: 'warning',
          description:
            'Coin98 Wallet is not installed. If this is the first time you install Coin98 wallet, please restart your browser to complete the setup.',
        }),
      )
    const wallet = new Coin98Wallet()
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
          <Avatar size={64} shape="square" src={COIN98} />
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, textAlign: 'center' }}>Coin98</p>
        </Col>
      </Row>
    </Card>
  )
}

export default Coin98
