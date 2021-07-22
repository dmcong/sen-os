import { forwardRef } from 'react'
import { Provider } from 'react-redux'

import { Widget } from 'sen-kit'

import SenOsProvider from 'helpers/senos'
import ErrorBoundary from 'components/errorBoundary'

import metadata from './package.json'
import View from './view'
import model from './model'

const Main = forwardRef(({ appName, ...rest }, ref) => {
  const {
    version,
    author: { email },
  } = metadata
  return (
    <ErrorBoundary appName={appName} version={version} email={email}>
      <SenOsProvider appName={appName}>
        <Provider store={model}>
          <Widget {...rest} type="glass" size="small" ref={ref}>
            <View />
          </Widget>
        </Provider>
      </SenOsProvider>
    </ErrorBoundary>
  )
})

export default Main
