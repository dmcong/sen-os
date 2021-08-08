import { useSelector } from 'react-redux'
import Login from './login'
import ListCollection from './listCollection'
import React from 'react'

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
      <div
        style={{
          opacity: deployID ? 0 : 1,
          transition: deployID ? undefined : 'opacity 1s',
          WebkitTransition: deployID ? undefined : 'opacity 1s',
          height: deployID ? 0 : undefined,
        }}
      >
        <Login></Login>
      </div>
    </React.Fragment>
  )
}

export default View
