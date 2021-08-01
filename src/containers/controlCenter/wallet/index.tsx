import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Space,
  Typography,
  Tooltip,
  Button,
  Icon,
  Divider,
} from '@senswap/sen-ui'
import Login from './login'
import WalletWatcher from './walletWatcher'

import util from 'helpers/util'
import session from 'helpers/session'
import { RootDispatch, RootState } from 'store'
import {
  connectWallet,
  openWallet,
  disconnectWallet,
} from 'store/wallet.reducer'
import { notify } from 'store/ui.reducer'
import {
  Coin98Wallet,
  PhantomWallet,
  SecretKeyWallet,
  SolletWallet,
} from './lib'

const Wallet = () => {
  const dispatch = useDispatch<RootDispatch>()
  const { infix } = useSelector((state: RootState) => state.ui)
  const { address, lamports } = useSelector((state: RootState) => state.wallet)

  const fontSize = infix === 'xs' ? 10 : 12
  const balance = numeral(utils.undecimalize(lamports, 9)).format('0.[00]')
  const reconnect = () => {
    const walletType = session.get('WalletType')
    if (walletType === 'SecretKey')
      return new SecretKeyWallet(session.get('SecretKey'))
    if (walletType === 'Keystore')
      return new SecretKeyWallet(session.get('SecretKey'))
    if (walletType === 'Coin98') return new Coin98Wallet()
    if (walletType === 'Phantom') return new PhantomWallet()
    if (walletType === 'Sollet') return new SolletWallet()
    return null
  }

  useEffect(() => {
    const wallet = reconnect()
    try {
      if (wallet) dispatch(connectWallet(wallet)).unwrap()
    } catch (er) {
      dispatch(notify({ type: 'error', description: er.message }))
    }
  }, [dispatch])

  if (!account.isAddress(address))
    return (
      <Space size={2}>
        <Typography.Text style={{ fontSize }}>Connect Wallet</Typography.Text>
        <Divider type="vertical" />
        <Button
          type="primary"
          icon={<Icon name="wallet-outline" />}
          onClick={() => dispatch(openWallet())}
        />
        <Login />
      </Space>
    )

  return (
    <Space size={0}>
      <Typography.Link
        style={{ color: '#ffffffd9', fontSize }}
        href={util.explorer(address)}
        target="_blank"
      >
        {address.substring(0, 4) + '..'} <Icon name="open-outline" />
      </Typography.Link>
      <Divider type="vertical" />
      <Tooltip title={`${utils.undecimalize(lamports, 9)} SOL`}>
        <Typography.Text style={{ fontSize }}>
          {balance} <span style={{ color: '#03E1FF' }}>◎</span>
        </Typography.Text>
      </Tooltip>
      <Divider type="vertical" />
      <Button
        type="text"
        className="contained"
        icon={<Icon name="power-outline" />}
        onClick={() => dispatch(disconnectWallet())}
      />
      <WalletWatcher />
    </Space>
  )
}

export default Wallet
