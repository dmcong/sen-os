import { useState, useCallback, useMemo } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Icon } from '@senswap/sen-ui'
import LazyLoad from 'react-lazyload'
import Search from './search'
import Mint from './mint'
import Pool from './pool'

import { useSenOs } from 'helpers/senos'
import { useSelector } from 'react-redux'
import { AppState } from '@/sen_swap/model'

export type SelectionInfo = {
  mintInfo?: TokenInfo
  poolAddress?: string
  poolAddresses: string[]
}

const MintSelection = ({
  value,
  onChange,
}: {
  value: SelectionInfo
  onChange: (value: SelectionInfo) => void
}) => {
  const [tempTokenInfo, setTempTokenInfo] = useState<TokenInfo>()
  const [mints, setMints] = useState<Array<TokenInfo>>([])
  const pools = useSelector((state: AppState) => state.pools)
  const settings = useSelector((state: AppState) => state.settings)
  const {
    senos: { tokenProvider },
  } = useSenOs()

  // Compute mints that appear in all pools
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
  // Compoute mint list
  const onMints = useCallback(
    async (value: null | Array<TokenInfo>) => {
      if (value) return setMints(value)
      const raw = await tokenProvider.all()
      const allMints = raw.filter(({ address }) => isSupportedMint(address))
      return setMints(allMints)
    },
    [tokenProvider, isSupportedMint],
  )
  // Compute available pools
  const getAvailablePoolAddresses = useCallback(
    (tokenInfo: TokenInfo | undefined) => {
      const mintAddress = tokenInfo?.address
      if (!mintAddress || !account.isAddress(mintAddress)) return []
      return Object.keys(pools).filter((poolAddress) => {
        const { mint_s, mint_a, mint_b } = pools[poolAddress]
        return [mint_s, mint_a, mint_b].includes(mintAddress)
      })
    },
    [pools],
  )

  // Return data to parent (users didn't select pool)
  const onMint = (tokenInfo: TokenInfo) => {
    const poolAddresses = getAvailablePoolAddresses(tokenInfo)
    return onChange({
      mintInfo: tokenInfo,
      poolAddress: undefined,
      poolAddresses,
    })
  }
  // Return data to parent (users specified a pool)
  const onPool = (poolAddress: string) => {
    const poolAddresses = getAvailablePoolAddresses(tempTokenInfo)
    return onChange({
      mintInfo: tempTokenInfo,
      poolAddress,
      poolAddresses,
    })
  }
  // Auto pool selection
  const onAuto = () => {
    const poolAddresses = getAvailablePoolAddresses(tempTokenInfo)
    return onChange({
      mintInfo: tempTokenInfo,
      poolAddress: undefined,
      poolAddresses,
    })
  }

  // Render mint list
  const mintList = mints.map((mint, i) => {
    const { logoURI, symbol, name, address } = mint
    const { address: currentMintAddress } = value.mintInfo || {}
    return (
      <Col span={24} key={name + i}>
        <LazyLoad height={48} overflow>
          <Mint
            logoURI={logoURI}
            symbol={symbol}
            name={name}
            onClick={() => onMint(mint)}
            advanced={settings.advanced}
            onAdvanced={() => setTempTokenInfo(mint)}
            active={currentMintAddress === address}
          />
        </LazyLoad>
      </Col>
    )
  })
  // Render pool list
  const poolList = getAvailablePoolAddresses(tempTokenInfo).map(
    (poolAddress, i) => {
      const { poolAddress: currentPoolAddress } = value
      const poolData = pools[poolAddress]
      return (
        <Col span={24} key={poolAddress + i}>
          <LazyLoad height={58} overflow>
            <Pool
              value={poolData}
              onClick={() => onPool(poolAddress)}
              active={poolAddress === currentPoolAddress}
            />
          </LazyLoad>
        </Col>
      )
    },
  )

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Search onChange={onMints} isSupportedMint={isSupportedMint} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300, overflowY: 'scroll' }}>
          {tempTokenInfo ? (
            <Col span={24}>
              <Row gutter={[8, 8]} wrap={false} align="middle">
                <Col flex="auto">
                  <Button
                    type="text"
                    className="contained"
                    icon={<Icon name="arrow-back-outline" />}
                    onClick={() => setTempTokenInfo(undefined)}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Typography.Text type="secondary">
                    Choose one favorite pool or
                  </Typography.Text>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<Icon name="sparkles-outline" />}
                    onClick={onAuto}
                  >
                    Auto
                  </Button>
                </Col>
              </Row>
            </Col>
          ) : null}
          {!tempTokenInfo ? mintList : poolList}
          <Col span={24} />
        </Row>
      </Col>
    </Row>
  )
}

export default MintSelection
