import { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import fileDownload from 'js-file-download'
import { keystore as ks, Keystore } from '@senswap/sen-js'

import {
  Row,
  Col,
  Icon,
  Button,
  Typography,
  Input,
  Modal,
} from '@senswap/sen-ui'

import { RootDispatch } from 'store'
import { notify } from 'store/ui.reducer'

const NewKeyStore = ({
  visible = false,
  onClose = () => {},
}: {
  visible: boolean
  onClose: () => void
}) => {
  const [password, setPassword] = useState('')
  const [keystore, setKeystore] = useState<Keystore | null>(null)
  const [visiblePwd, setVisiblePwd] = useState(false)
  const dispatch = useDispatch<RootDispatch>()

  useEffect(() => {
    setPassword('')
    setKeystore(null)
    setVisiblePwd(false)
  }, [visible])
  useEffect(() => {
    setKeystore(ks.gen(password))
  }, [password])

  const onDownload = () => {
    if (!keystore)
      return dispatch(
        notify({
          type: 'error',
          description: 'Cannot download a empty keystore',
        }),
      )
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
