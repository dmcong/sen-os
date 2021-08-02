import { useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import { Space, Avatar, Typography } from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'

const MintAvatar = ({ mintAddress }: { mintAddress: string }) => {
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
    <Space>
      <Avatar src={logoURI || '#'} size={20} />
      <Typography.Text>{symbol || 'TOKEN'}</Typography.Text>
    </Space>
  )
}

export default MintAvatar
