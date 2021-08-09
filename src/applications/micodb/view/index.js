import { useSelector } from 'react-redux'
import Login from './login'
import ListCollection from './listCollection'
import React from 'react'

//
const View = () => {
  const deployID = useSelector((state) => state.main.deployID)
  return (
    <React.Fragment>
      <div
        style={{
          opacity: deployID ? 1 : 0,
          transition: deployID ? 'opacity 1s' : undefined,
          WebkitTransition: deployID ? 'opacity 1s' : undefined,
          height: deployID ? undefined : 0,
        }}
      >
        <ListCollection />
      </div>

      {!deployID && <Login></Login>}
    </React.Fragment>
  )
}

export default View
