import React, { useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import { Space, Avatar, Typography, Icon } from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'

const MintAvatar = ({
  mintAddress,
  size = 20,
  icon = <Icon name="diamond-outline" />,
}: {
  mintAddress: string
  size?: number
  icon?: React.ReactNode
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
  const shortenMintAddress = mintAddress.substring(0, 6)
  return (
    <Space style={{ lineHeight: 1 }}>
      <Avatar src={logoURI || '#'} size={size}>
        {icon}
      </Avatar>
      <Typography.Text>{symbol || shortenMintAddress}</Typography.Text>
    </Space>
  )
}

export default MintAvatar
