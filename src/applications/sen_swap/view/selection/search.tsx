import React, { useCallback, useEffect, useState } from 'react'

import { Row, Col, Card, Icon, Input, Button } from '@senswap/sen-ui'
import { useSenOs } from 'helpers/senos'
import { TokenInfo } from '@solana/spl-token-registry'

const KEYSIZE = 3

const Search = ({
  onChange,
  isSupportedMint,
  disabled = false,
}: {
  onChange: (data: TokenInfo[] | null) => void
  isSupportedMint: (mintAddress: string) => boolean
  disabled?: boolean
}) => {
  const [keyword, setKeyword] = useState('')
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(null)
    const raw = await tokenProvider.find(keyword)
    const data = raw.filter(({ address }) => isSupportedMint(address))
    return onChange(data)
  }, [keyword, tokenProvider, onChange, isSupportedMint])

  useEffect(() => {
    search()
  }, [search])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <Input
            placeholder="Search"
            value={keyword}
            size="small"
            bordered={false}
            suffix={
              <Button
                type="text"
                style={{ marginRight: -7 }}
                size="small"
                onClick={keyword ? () => setKeyword('') : () => {}}
                icon={
                  <Icon name={keyword ? 'close-outline' : 'search-outline'} />
                }
                disabled={disabled}
              />
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setKeyword(e.target.value)
            }
            disabled={disabled}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Search
