import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { account, SecretKeyWallet } from '@senswap/sen-js'

import {
  Row,
  Col,
  Typography,
  Input,
  Icon,
  Button,
  Space,
} from '@senswap/sen-ui'

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
    const acc = account.createAccount()
    const secretKey = Buffer.from(acc.secretKey).toString('hex')
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
