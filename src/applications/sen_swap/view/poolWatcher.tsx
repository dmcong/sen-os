import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useSenOs } from 'helpers/senos'
import { getPools, upsetPool } from '@/sen_swap/controller/pool.controller'
import { AppDispatch } from '@/sen_swap/model'

// Watch id
let watchId = 0

const PoolWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    senos: { notify },
  } = useSenOs()

  const fetchData = useCallback(async () => {
    try {
      await dispatch(getPools()).unwrap()
    } catch (er) {
      await notify({
        type: 'error',
        description: 'Cannot fetch data for pools',
      })
    }
  }, [dispatch, notify])

  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    const callback = (er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetPool({ address, data }))
    }
    watchId = window.senos.swap.watch(callback)
  }, [dispatch])

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

export default PoolWatcher
