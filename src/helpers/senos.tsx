import {
  createContext,
  useContext,
  Children,
  cloneElement,
  Component,
  forwardRef,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ssjs from 'senswapjs'

import PDB from 'helpers/pdb'
import { RootState, RootDispatch } from 'store'
import { notify } from 'store/ui.reducer'

const Context = createContext({})

const SenOsProvider = ({
  children,
  appName,
}: {
  children: JSX.Element
  appName: string
}) => {
  const dispatch = useDispatch<RootDispatch>()
  const senos = {
    // UI instance
    ui: useSelector((state: RootState) => state.ui),
    notify: (...agrs: Parameters<typeof notify>) => dispatch(notify(...agrs)),
    // Wallet instance
    wallet: useSelector((state: RootState) => state.wallet),
    // DB instance
    get db() {
      const address = this.wallet.address
      const pdb = ssjs.isAddress(address) ? new PDB(address) : null
      return pdb?.createInstance(appName)
    },
  }
  // Context provider
  return <Context.Provider value={{ senos }}>{children}</Context.Provider>
}

const SenOsComsumer = ({ children }: { children: JSX.Element }) => {
  return (
    <Context.Consumer>
      {(value) =>
        Children.map(children, (child) => cloneElement(child, { ...value }))
      }
    </Context.Consumer>
  )
}

const withSenOs = (WrappedComponent: typeof Component) => {
  class HOC extends Component<any, any> {
    render() {
      const { forwardedRef, ...rest } = this.props
      return (
        <SenOsComsumer>
          <WrappedComponent ref={forwardedRef} {...rest} />
        </SenOsComsumer>
      )
    }
  }
  return forwardRef<HTMLElement, any>((props, ref) => (
    <HOC {...props} ref={ref} />
  ))
}

const useSenOs = () => {
  return useContext(Context)
}

export { withSenOs, useSenOs }
export default SenOsProvider
