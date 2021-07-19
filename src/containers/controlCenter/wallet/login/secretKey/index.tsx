import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import ssjs, { SecretKeyWallet } from 'senswapjs'

import { Row, Col, Typography, Input, Icon, Button, Space } from 'sen-kit'

import { RootDispatch } from 'store'
import { connectWallet } from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'

const SecretKey = () => {
  const [secretKey, setSecretKey] = useState('')
  const dispatch = useDispatch<RootDispatch>()

  const connect = async () => {
    if (!secretKey)
      return dispatch(
        notify({
          type: 'warning',
          description: 'Please enter your secret key',
        }),
      )
    const wallet = new SecretKeyWallet(secretKey)
    try {
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er) {
      return dispatch(notify({ type: 'error', description: er.message }))
    }
  }

  const onGen = () => {
    const account = ssjs.createAccount()
    const secretKey = Buffer.from(account.secretKey).toString('hex')
    return setSecretKey(secretKey)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Icon name="key" />
          <Typography.Text>Secret Key</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>
          The secret key is a raw form of your wallet, then it's very unsecure
          and not recommended to use.
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          placeholder="Secret Key"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSecretKey(e.target.value || '')
          }
          value={secretKey}
          suffix={
            <Button
              type="primary"
              onClick={connect}
              icon={<Icon name="lock-open" />}
              style={{ marginRight: -8 }}
            />
          }
        />
      </Col>
      <Col span={24} style={{ marginTop: -8 }}>
        <Typography.Link onClick={onGen}>
          <Space>
            <Icon name="add-circle-outline" />
            <span>Create a secret key</span>
          </Space>
        </Typography.Link>
      </Col>
    </Row>
  )
}

export default SecretKey
