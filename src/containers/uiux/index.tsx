import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { RootDispatch } from 'store'
import { resize } from 'store/ui.reducer'
import Sync from './sync'

const UiUx = () => {
  const dispatch = useDispatch<RootDispatch>()

  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return (
    <Fragment>
      <Sync />
    </Fragment>
  )
}

export default UiUx
