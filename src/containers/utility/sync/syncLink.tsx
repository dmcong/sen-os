import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Row, Col, Icon, Input, Tooltip, Button } from 'sen-kit'

import PDB from 'helpers/pdb'
import util from 'helpers/util'

export const parseCID = (link: string): string => {
  try {
    const { search } = new URL(link)
    const params = new URLSearchParams(search)
    const cid = params.get('sync') as string
    if (PDB.isCID(cid)) return cid
    return ''
  } catch (er) {
    return ''
  }
}

const SyncLink = ({
  value = '',
  onChange = () => {},
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await setCopied(true)
    await util.asyncWait(1500)
    await setCopied(false)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Input
          placeholder="https://app.senswap.com/home?sync=..."
          prefix={
            <Button
              type="text"
              size="small"
              style={{ marginLeft: -7 }}
              icon={<Icon name="cube-outline" />}
            />
          }
          suffix={
            <Tooltip title="Copied" visible={copied}>
              <CopyToClipboard text={value} onCopy={onCopy}>
                <Button
                  type="text"
                  size="small"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="copy-outline" />}
                  disabled={!value}
                />
              </CopyToClipboard>
            </Tooltip>
          }
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value || '')
          }
        />
      </Col>
    </Row>
  )
}

export default SyncLink
