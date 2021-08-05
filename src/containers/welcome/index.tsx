import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Icon, Tooltip } from '@senswap/sen-ui'

import { RootDispatch, RootState } from 'store'
import { openWallet } from 'store/wallet.reducer'

const Welcome = () => {
  const history = useHistory()
  const dispatch = useDispatch<RootDispatch>()
  const { infix } = useSelector((state: RootState) => state.ui)
  const { address: walletAddress } = useSelector(
    (state: RootState) => state.wallet,
  )

  const onStart = async () => {
    await dispatch(openWallet())
  }

  useEffect(() => {
    if (account.isAddress(walletAddress)) return history.push('/home')
  }, [walletAddress, history])

  return (
    <Row gutter={[32, 32]} justify="center">
      <Col span={24} style={{ height: 96 }} />
      <Col sm={{ span: 24 }} md={{ span: 16 }}>
        <Typography.Title
          level={1}
          style={{ fontSize: infix === 'xs' ? 60 : 70 }}
          align="center"
        >
          An Open Liquidity Protocol for Token Swap on Solana
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button
              size="large"
              type="primary"
              shape="round"
              icon={<Icon name="planet-outline" />}
              onClick={onStart}
            >
              Let's Explore SEN
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Tooltip title="Telegram">
              <Button
                type="text"
                className="contained"
                size="large"
                icon={<Icon name="paper-plane" />}
                href="https://t.me/SenSwap"
                target="_blank"
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Twitter">
              <Button
                type="text"
                className="contained"
                size="large"
                icon={<Icon name="logo-twitter" />}
                href="https://twitter.com/SenSwap"
                target="_blank"
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Medium">
              <Button
                type="text"
                className="contained"
                size="large"
                icon={<Icon name="logo-medium" />}
                href="https://blogs.senswap.com"
                target="_blank"
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Whitepaper">
              <Button
                type="text"
                className="contained"
                size="large"
                icon={<Icon name="document" />}
                href="/static/media/senswap_whitepaper.663e0af6.pdf"
                target="_blank"
              />
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Welcome
