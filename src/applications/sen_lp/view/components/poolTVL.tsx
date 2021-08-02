import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import numeral from 'numeral'

import { useSenOs } from 'helpers/senos'
import { AppDispatch } from '../../model'
import { getPool } from '../../controller/pools.controller'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, utils } from '@senswap/sen-js'

const PoolTVL = ({ poolAddress }: { poolAddress: string }) => {
  const [tvl, setTVL] = useState(0)
  const dispatch = useDispatch<AppDispatch>()
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const getTVL = useCallback(async () => {
    try {
      const {
        [poolAddress]: {
          reserve_a,
          reserve_b,
          reserve_s,
          mint_a,
          mint_b,
          mint_s,
        },
      } = await dispatch(getPool({ address: poolAddress })).unwrap()
      const mintAddresses = [mint_a, mint_b, mint_s]
      const tokenInfos: Array<TokenInfo | any> = await Promise.all(
        mintAddresses.map((mintAddress) => {
          if (!mintAddress || !account.isAddress(mintAddress)) return {}
          return tokenProvider.findByAddress(mintAddress)
        }),
      )
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
    } catch (er) {
      return setTVL(0)
    }
  }, [dispatch, poolAddress, tokenProvider])

  useEffect(() => {
    getTVL()
  }, [getTVL])

  return <span>${numeral(tvl).format('0,0.[00]a')}</span>
}

export default PoolTVL
