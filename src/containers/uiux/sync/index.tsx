import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  Row,
  Col,
  Icon,
  Input,
  Tooltip,
  Button,
  Modal,
  Typography,
} from 'sen-kit'
import Policy from './policy'

import PDB from 'helpers/pdb'
import util from 'helpers/util'
import { RootState } from 'store'
import { toggleSync, notify } from 'store/ui.reducer'

const parseCID = (link: string): string | undefined => {
  const elements = link.split('/')
  while (elements.length) {
    const element = elements.pop() || ''
    if (PDB.isCID(element)) return element
  }
  return undefined
}

const Sync = () => {
  const [copied, setCopied] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [link, setLink] = useState('')
  const dispatch = useDispatch()

  const { visibleSync } = useSelector((state: RootState) => state.ui)
  const { address } = useSelector((state: RootState) => state.wallet)
  const pdb = new PDB(address)

  useEffect(() => {
    setReviewed(false)
  }, [visibleSync])

  const onCopy = async () => {
    await setCopied(true)
    await util.asyncWait(1500)
    await setCopied(false)
  }

  const onBackup = async () => {
    const cid = await pdb.backup()
    return setLink(`https://ipfs.io/ipfs/${cid}`)
  }

  const onRestore = async () => {
    const cid = parseCID(link)
    if (!cid)
      return dispatch(
        notify({
          type: 'error',
          description: 'Invalid backup link format',
        }),
      )
    await pdb.restore(cid)
    await dispatch(toggleSync(false))
    return window.location.reload()
  }

  return (
    <Modal
      visible={visibleSync}
      onCancel={() => toggleSync(false)}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Backup & Restore
          </Typography.Title>
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Input
            placeholder="https://ipfs.io/ipfs/..."
            prefix={
              <Button
                type="link"
                size="small"
                style={{ marginLeft: -7 }}
                icon={<Icon name="cube-outline" />}
                href={
                  link ||
                  'https://ipfs.io/ipfs/QmU272qrKY9LGNBFqHVUkVgycdvSs766L2hAsRUELYr19B'
                }
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            suffix={
              <Tooltip title="Copied" visible={copied}>
                <CopyToClipboard text={link} onCopy={onCopy}>
                  <Button
                    type="text"
                    size="small"
                    style={{ marginRight: -7 }}
                    icon={<Icon name="copy-outline" />}
                    disabled={!link}
                  />
                </CopyToClipboard>
              </Tooltip>
            }
            value={link}
            onChange={(e: any) => setLink(e.target.value || '')}
          />
        </Col>
        <Col span={24}>
          <Policy value={reviewed} onChange={setReviewed} />
        </Col>
        <Col span={10}>
          <Button
            type="text"
            className="contained"
            icon={<Icon name="push-outline" />}
            onClick={onRestore}
            block
          >
            Restore
          </Button>
        </Col>
        <Col span={14}>
          <Button
            type="primary"
            icon={<Icon name="color-wand-outline" />}
            onClick={onBackup}
            disabled={!reviewed}
            block
          >
            Gen a backup link
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Sync
