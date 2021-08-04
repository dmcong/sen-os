import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { RootDispatch } from 'store'
import { resize } from 'store/ui.reducer'
import Sync from './sync'
import Preset from './preset'
import AccountWatcher from './accountWatcher'

const Utility = () => {
  const dispatch = useDispatch<RootDispatch>()

  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return (
    <Fragment>
      <Sync />
      <Preset />
      <AccountWatcher />
    </Fragment>
  )
}

export default Utility
