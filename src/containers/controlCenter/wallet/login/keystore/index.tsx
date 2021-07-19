import { ChangeEvent, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { KeystoreWallet } from 'senswapjs'

import { Row, Col, Space, Icon, Button, Typography, Input } from 'sen-kit'
import NewKeyStore from './newKeystore'

import { RootDispatch } from 'store'
import { connectWallet } from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'

const KeyStore = () => {
  const [password, setPassword] = useState('')
  const [filename, setFilename] = useState('')
  const [keystore, setKeystore] = useState({})
  const [visible, setVisible] = useState(false)

  const refFile = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch<RootDispatch>()

  const onKeystore = (e: ChangeEvent<HTMLInputElement>) => {
    const [file]: any = e?.target?.files
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = () => {
        setFilename(file.name)
        setKeystore(JSON.parse(reader.result as string) || {})
      }
    }
  }

  const connect = async () => {
    if (!keystore)
      return dispatch(
        notify({
          type: 'warning',
          description: 'Please upload your keystore',
        }),
      )
    if (!password)
      return dispatch(
        notify({
          type: 'warning',
          description: 'Please enter your password to unlock your wallet',
        }),
      )
    try {
      console.log(typeof keystore, password)
      const wallet = new KeystoreWallet(keystore, password)
      console.log('keystore, password')
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er) {
      return dispatch(notify({ type: 'error', description: er.message }))
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Icon name="document-lock" />
          <Typography.Text>Keystore</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>
          This keystore format is compatible with{' '}
          <Typography.Link
            href="https://solflare.com"
            target="_blank"
            rel="noopener"
          >
            SolFlare
          </Typography.Link>{' '}
          keystore.
        </Typography.Text>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Filename"
          value={filename}
          suffix={
            <Button
              type="text"
              icon={<Icon name="cloud-upload" />}
              style={{ marginRight: -8 }}
              onClick={() => refFile.current?.click()}
            >
              Upload
            </Button>
          }
          readOnly
        />
        <input
          ref={refFile}
          type="file"
          accept="application/json"
          onChange={onKeystore}
          style={{ display: 'none' }}
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value || '')
          }
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
        <Typography.Link onClick={() => setVisible(true)}>
          <Space>
            <Icon name="add-circle-outline" />
            <span>Create a keystore</span>
          </Space>
        </Typography.Link>
      </Col>
      <NewKeyStore visible={visible} onClose={() => setVisible(false)} />
    </Row>
  )
}

export default KeyStore
