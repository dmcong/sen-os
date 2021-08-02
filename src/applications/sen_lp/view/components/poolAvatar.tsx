import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Avatar, Icon } from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'
import { AppDispatch } from '../../model'
import { getPool } from '../../controller/pools.controller'

const PoolAvatar = ({
  poolAddress,
  onClick = () => {},
  size = 32,
}: {
  poolAddress: string
  onClick?: () => void
  size?: number
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    senos: { tokenProvider },
  } = useSenOs()
  const [logoURIs, setLogoURIs] = useState<string[]>([])

  const getLogoURIs = useCallback(async () => {
    try {
      const {
        [poolAddress]: { mint_s, mint_a, mint_b },
      } = await dispatch(getPool({ address: poolAddress })).unwrap()
      const mintAddresses = [mint_s, mint_a, mint_b]
      const logoURIs = await Promise.all(
        mintAddresses.map(async (mintAddress) => {
          const tokenInfo = await tokenProvider.findByAddress(mintAddress)
          return tokenInfo?.logoURI || '#'
        }),
      )
      return setLogoURIs(logoURIs)
    } catch (er) {
      return setLogoURIs([])
    }
  }, [poolAddress, tokenProvider])

  useEffect(() => {
    getLogoURIs()
  }, [getLogoURIs])

  return (
    <Avatar.Group style={{ marginTop: 4, marginBottom: 4 }} onClick={onClick}>
      {logoURIs.map((logoURI, i) => (
        <Avatar
          key={i}
          src={logoURI}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          <Icon name="diamond-outline" />
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default PoolAvatar
