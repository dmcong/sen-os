import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { RootDispatch } from 'store'
import { resize } from 'store/ui.reducer'
import Sync from './sync'
import Preset from './preset'

const Utility = () => {
  const dispatch = useDispatch<RootDispatch>()

  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return (
    <Fragment>
      <Sync />
      <Preset />
    </Fragment>
  )
}

export default Utility
