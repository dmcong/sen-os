import { useDispatch } from 'react-redux'
import { Coin98Wallet } from 'senswapjs'

import { Row, Col, Button, Typography, Icon, Avatar, Space } from 'sen-kit'

import COIN98 from 'static/images/coin98.png'
import { RootDispatch } from 'store'
import { connectWallet } from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'

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
            'Coin98 Wallet is not installed. If this is the first time you install Coin98 wallet, please restart your browser to finish the setup.',
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="baseline">
          <Avatar src={COIN98} />
          <Typography.Title level={5}>Coin98 Wallet</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>
          Coin98 Wallet Extension is a variant of Coin98 Wallet for Chrome
          extension. You can{' '}
          <Typography.Link
            href="https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en"
            target="_blank"
            rel="noopener"
          >
            click here to install.
          </Typography.Link>
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={connect}
          icon={<Icon name="lock-open" />}
          block
        >
          Connect Coin98 Wallet
        </Button>
      </Col>
    </Row>
  )
}

export default Coin98
