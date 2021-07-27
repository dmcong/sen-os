import { useState, Fragment, useCallback, useMemo } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import {
  Row,
  Col,
  Avatar,
  Icon,
  Space,
  Typography,
  Divider,
  Modal,
} from '@senswap/sen-ui'
import Search from './search'
import Mint from './mint'

import { useSenOs } from 'helpers/senos'
import { useSelector } from 'react-redux'
import { AppState } from '@/sen_swap/model'

const MintSelection = ({
  value,
  onChange,
}: {
  value: TokenInfo
  onChange: (value: TokenInfo) => void
}) => {
  const [visible, setVisible] = useState(false)
  const [mints, setMints] = useState<Array<TokenInfo>>([])
  const pools = useSelector((state: AppState) => state.pools)
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const supportedMints = useMemo(
    () =>
      Object.keys(pools)
        .map((poolAddress) => {
          const { mint_a, mint_b, mint_s } = pools[poolAddress]
          return [mint_a, mint_b, mint_s]
        })
        .flat()
        .filter((item, pos, self) => self.indexOf(item) === pos),
    [pools],
  )
  const isSupportedMint = useCallback(
    (mintAddress) => supportedMints.includes(mintAddress),
    [supportedMints],
  )
  const onMints = useCallback(
    async (value: null | Array<TokenInfo>) => {
      if (value) return setMints(value)
      const raw = await tokenProvider.all()
      const allMints = raw.filter(({ address }) => isSupportedMint(address))
      return setMints(allMints)
    },
    [tokenProvider, isSupportedMint],
  )

  const onMint = (mint: TokenInfo) => {
    setVisible(false)
    onChange(mint)
  }
  const { logoURI, symbol } = value

  return (
    <Fragment>
      <Space
        style={{ marginLeft: -6, cursor: 'pointer' }}
        onClick={() => setVisible(true)}
      >
        <Avatar size={24} src={logoURI}>
          <Icon name="diamond-outline" />
        </Avatar>
        <Typography.Text type="secondary" style={{ margin: 0 }}>
          {symbol || 'TOKEN'}
        </Typography.Text>
        <Divider type="vertical" style={{ marginLeft: 4 }} />
      </Space>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={5}>Token Selection</Typography.Title>
          </Col>
          <Col span={24}>
            <Search onChange={onMints} isSupportedMint={isSupportedMint} />
          </Col>
          <Col span={24}>
            <Row
              gutter={[16, 16]}
              style={{ maxHeight: 380, overflowY: 'scroll' }}
            >
              {mints.map((mint, i) => {
                const { logoURI, symbol, name } = mint
                return (
                  <Col span={24} key={name + i}>
                    <Mint
                      logoURI={logoURI}
                      symbol={symbol}
                      name={name}
                      onClick={() => onMint(mint)}
                    />
                  </Col>
                )
              })}
              <Col span={24} />
            </Row>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default MintSelection
