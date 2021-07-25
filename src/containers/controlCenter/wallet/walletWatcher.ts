import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { updateWallet } from 'store/wallet.reducer'
import { RootDispatch, RootState } from 'store'

let watchId: any = null

const WalletWatcher = () => {
  const dispatch = useDispatch<RootDispatch>()
  const { address } = useSelector((state: RootState) => state.wallet)

  const watchData = useCallback(async () => {
    if (!account.isAddress(address)) {
      try {
        await window.senos.lamports.unwatch(watchId)
      } catch (er) {
        /* Nothing */
      }
      watchId = null
    } else {
      if (watchId) return console.warn('Already watched')
      const callback = (er: string, re: bigint) => {
        if (er) return console.error(er)
        return dispatch(updateWallet({ lamports: re }))
      }
      watchId = window.senos.lamports.watch(address, callback)
    }
  }, [dispatch, address])

  useEffect(() => {
    watchData()
  }, [watchData])

  return null
}

export default WalletWatcher
