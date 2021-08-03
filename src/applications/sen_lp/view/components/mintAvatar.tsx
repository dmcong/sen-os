import { useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import { Space, Avatar, Typography } from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'

const MintAvatar = ({
  mintAddress,
  size = 20,
}: {
  mintAddress: string
  size?: number
}) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>()
  const {
    senos: { tokenProvider },
  } = useSenOs()

  useEffect(() => {
    ;(async () => {
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      return setTokenInfo(tokenInfo)
    })()
  }, [mintAddress, tokenProvider])

  const { logoURI, symbol } = tokenInfo || {}
  return (
    <Space style={{ lineHeight: 1 }}>
      <Avatar src={logoURI || '#'} size={size} />
      <Typography.Text>{symbol || 'TOKEN'}</Typography.Text>
    </Space>
  )
}

export default MintAvatar
