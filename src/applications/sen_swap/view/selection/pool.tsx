import { useCallback, useEffect, useState } from 'react'
import { account, PoolData, utils } from '@senswap/sen-js'
import numeral from 'numeral'
import { TokenInfo } from '@solana/spl-token-registry'

import {
  Space,
  Avatar,
  Icon,
  Typography,
  Card,
  Divider,
  Tooltip,
} from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'

const Pool = ({
  value,
  onClick,
  active = false,
}: {
  value: PoolData | undefined
  onClick: () => void
  active?: boolean
}) => {
  const [tvl, setTVL] = useState(0)
  const [tokenInfos, setTokenInfos] = useState<Array<TokenInfo | any>>([
    {},
    {},
    {},
  ])
  const {
    senos: { tokenProvider },
  } = useSenOs()

  // Get in-pool token info
  const getTokenInfos = useCallback(async () => {
    const { mint_a, mint_b, mint_s } = value || {}
    const tokenInfos = await Promise.all(
      [mint_a, mint_b, mint_s].map((mintAddress) => {
        if (!mintAddress || !account.isAddress(mintAddress)) return {}
        return tokenProvider.findByAddress(mintAddress)
      }),
    )
    return setTokenInfos(tokenInfos)
  }, [value, tokenProvider])
  // Compute total locked value
  const getTVL = useCallback(async () => {
    const { reserve_a, reserve_b, reserve_s } = value || {}
    const reserves = [reserve_a, reserve_b, reserve_s]
    const decimals = tokenInfos.map(({ decimals }) => decimals)
    const data = await Promise.all(
      tokenInfos.map(({ extensions }) => {
        if (!extensions?.coingeckoId) return {} as any
        return utils.parseCGK(extensions?.coingeckoId)
      }),
    )
    const prices = data.map(({ price }) => price)
    let tvl = 0
    ;[0, 1, 2].forEach((i) => {
      if (reserves[i] && decimals[i] && prices[i])
        tvl =
          tvl +
          Number(utils.undecimalize(reserves[i] as bigint, decimals[i])) *
            prices[i]
    })
    return setTVL(tvl)
  }, [tokenInfos, value])

  useEffect(() => {
    getTokenInfos()
  }, [getTokenInfos])
  useEffect(() => {
    getTVL()
  }, [getTVL])

  return (
    <Card
      bodyStyle={{ padding: `8px 16px`, cursor: 'pointer' }}
      bordered={active}
      onClick={onClick}
      hoverable
    >
      <Space size={12} style={{ fontSize: 11, marginLeft: -8 }}>
        <Avatar.Group style={{ margin: 4 }}>
          {tokenInfos.map(({ address, logoURI }, i) => (
            <Avatar
              key={address + i}
              src={logoURI}
              size={32}
              style={{ backgroundColor: '#2D3355', border: 'none' }}
            >
              <Icon name="diamond-outline" />
            </Avatar>
          ))}
        </Avatar.Group>
        <Typography.Text style={{ margin: 0 }}>
          {tokenInfos.map(({ symbol }) => symbol).join(' • ')}
        </Typography.Text>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Space size={6}>
          <Tooltip title="The TVL here is roughly estimated and maybe not precise because some unknown tokens ain't involved in the computation">
            <Space size={4}>
              <Typography.Text type="secondary" style={{ margin: 0 }}>
                <Icon name="information-circle-outline" />
              </Typography.Text>
              <Typography.Text type="secondary" style={{ margin: 0 }}>
                TVL:
              </Typography.Text>
            </Space>
          </Tooltip>
          <Typography.Text style={{ margin: 0 }}>
            ${numeral(tvl).format('0.[00]a')}
          </Typography.Text>
        </Space>
      </Space>
    </Card>
  )
}

export default Pool
