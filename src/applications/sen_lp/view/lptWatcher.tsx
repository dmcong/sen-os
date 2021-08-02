import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useSenOs } from 'helpers/senos'
import { getLPTs, upsetLPT } from '@/sen_lp/controller/lpts.controller'
import { AppDispatch } from '@/sen_swap/model'

// Watch id
let watchId = 0

const LptWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    senos: {
      notify,
      wallet: { address: walletAddress },
    },
  } = useSenOs()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      await dispatch(getLPTs({ owner: walletAddress })).unwrap()
    } catch (er) {
      await notify({
        type: 'error',
        description: 'Cannot fetch data for pools',
      })
    }
  }, [dispatch, notify, walletAddress])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    const callback = (er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetLPT({ address, data }))
    }
    const filters = [{ memcmp: { bytes: walletAddress, offset: 32 } }]
    watchId = window.senos.splt.watch(callback, filters)
  }, [dispatch, walletAddress])
  // Unwatch (cancel socket) when component unmounts
  const unwatchData = useCallback(async () => {
    try {
      await window.senos.splt.unwatch(watchId)
    } catch (er) {
      /* Nothing */
    }
    watchId = 0
  }, [])

  useEffect(() => {
    fetchData()
    watchData()
    return () => {
      unwatchData()
    }
  }, [fetchData, watchData, unwatchData])

  return <Fragment />
}

export default LptWatcher
