import { ChangeEvent, useState, useEffect } from 'react'
import fileDownload from 'js-file-download'
import ssjs from 'senswapjs'

import { Row, Col, Icon, Button, Typography, Input, Modal } from 'sen-kit'

const NewKeyStore = ({
  visible = false,
  onClose = () => {},
}: {
  visible: boolean
  onClose: () => void
}) => {
  const [password, setPassword] = useState('')
  const [keystore, setKeystore] = useState<{ publicKey?: string }>({})
  const [visiblePwd, setVisiblePwd] = useState(false)

  useEffect(() => {
    setPassword('')
    setKeystore({})
    setVisiblePwd(false)
  }, [visible])
  useEffect(() => {
    setKeystore(ssjs.gen(password))
  }, [password])

  const onDownload = () => {
    fileDownload(
      JSON.stringify(keystore),
      `senwallet-keystore-${keystore.publicKey}.json`,
    )
    return onClose()
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<Icon name="close" />}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title>New Keystore</Typography.Title>
          <Typography.Text>
            The password is used to encrypt your keystore. You will need this
            password to unlock your keystore later.
          </Typography.Text>
        </Col>
        <Col span={24} style={{ height: 16 }} />
        <Col span={24}>
          <Input
            label="Password"
            type={visiblePwd ? 'text' : 'password'}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value || '')
            }
            suffix={
              <Button
                type="text"
                onClick={() => setVisiblePwd(!visiblePwd)}
                style={{ marginRight: -8 }}
                icon={
                  visiblePwd ? <Icon name="eye-off" /> : <Icon name="eye" />
                }
              />
            }
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Button
                type="primary"
                icon={<Icon name="cloud-download" />}
                onClick={onDownload}
                disabled={!keystore || !keystore.publicKey}
              >
                Download
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default NewKeyStore
