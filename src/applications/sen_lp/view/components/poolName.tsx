import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSenOs } from 'helpers/senos'
import { AppDispatch } from '../../model'
import { getPool } from '../../controller/pools.controller'

const PoolName = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    senos: { tokenProvider },
  } = useSenOs()
  const [name, setName] = useState('UNKNOWN')

  const getName = useCallback(async () => {
    try {
      const {
        [poolAddress]: { mint_s, mint_a, mint_b },
      } = await dispatch(getPool({ address: poolAddress })).unwrap()
      const mintAddresses = [mint_s, mint_a, mint_b]
      const symbols = await Promise.all(
        mintAddresses.map(async (mintAddress) => {
          const tokenInfo = await tokenProvider.findByAddress(mintAddress)
          return tokenInfo?.symbol || 'TOKEN'
        }),
      )
      return setName(symbols.join(' • '))
    } catch (er) {
      return setName('UNKNOWN')
    }
  }, [dispatch, poolAddress, tokenProvider])

  useEffect(() => {
    getName()
  }, [getName])

  return <span>{name}</span>
}

export default PoolName
