import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { RootDispatch, RootState } from 'store'
import { notify } from 'store/ui.reducer'
import { getAccounts, upsetAccount } from 'store/accounts.reducer'

// Watch id
let watchId = 0

const AccountWatcher = () => {
  const dispatch = useDispatch<RootDispatch>()
  const { address: walletAddress } = useSelector(
    (state: RootState) => state.wallet,
  )

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      if (!account.isAddress(walletAddress)) return
      await dispatch(getAccounts({ owner: walletAddress })).unwrap()
    } catch (er) {
      await dispatch(
        notify({
          type: 'error',
          description: 'Cannot fetch data for pools',
        }),
      )
    }
  }, [dispatch, walletAddress])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (!account.isAddress(walletAddress))
      return console.warn('Wallet is not connected')
    if (watchId) return console.warn('Already watched')
    const { splt } = window.senos || {}
    const filters = [{ memcmp: { bytes: walletAddress, offset: 32 } }]
    watchId = splt?.watch((er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetAccount({ address, data }))
    }, filters)
  }, [dispatch, walletAddress])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await window.senos.splt.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default AccountWatcher
