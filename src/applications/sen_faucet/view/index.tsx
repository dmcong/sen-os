import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Icon } from '@senswap/sen-ui'
import Mint from './mint'

import { useSenOs } from 'helpers/senos'
import { AppDispatch, AppState } from '../model'
import { airdrop } from '../controller/main.controller'
import util from 'helpers/util'

const MINTS = [
  '8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM',
  '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
  '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
]

const View = () => {
  const [mintAddress, setMintAddress] = useState(MINTS[0])
  const [srcAddress, setSrcAddress] = useState('')
  const [dstAddress, setDstAddress] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const { address: payerAddress } = useSelector((state: AppState) => state.main)
  const {
    senos: {
      wallet: { address: walletAddress },
      accounts,
      notify,
    },
  } = useSenOs()

  const isValid = account.isAddress(srcAddress) && account.isAddress(dstAddress)

  const onAirdrop = async () => {
    if (!isValid) return
    const { lamports } = window.senos
    const { amount } = accounts[dstAddress] || {}
    if (amount && amount > BigInt(2000000000))
      return notify({
        type: 'warning',
        description:
          'You already had the token. We have to reject the request to reserve tokens for other people.',
      })
    await lamports.airdrop(BigInt(1000000000), walletAddress)
    try {
      const { txId } = await dispatch(
        airdrop({ srcAddress, dstAddress }),
      ).unwrap()
      return notify({
        type: 'success',
        description: 'Airdrop successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

  useEffect(() => {
    ;(async () => {
      const { splt } = window.senos
      if (!account.isAddress(mintAddress)) {
        setSrcAddress('')
        setDstAddress('')
      } else {
        const srcAddress = await splt.deriveAssociatedAddress(
          payerAddress,
          mintAddress,
        )
        const dstAddress = await splt.deriveAssociatedAddress(
          walletAddress,
          mintAddress,
        )
        setSrcAddress(srcAddress)
        setDstAddress(dstAddress)
      }
    })()
  }, [mintAddress, walletAddress, payerAddress])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={1}>Sen Faucet</Typography.Title>
      </Col>
      <Col span={24}>
        <Mint
          mintAddresses={MINTS}
          value={mintAddress}
          onChange={setMintAddress}
        />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={<Icon name="pizza-outline" />}
          disabled={!isValid}
          onClick={onAirdrop}
          block
        >
          Faucet
        </Button>
      </Col>
    </Row>
  )
}

export default View
