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
  // UI instance
  const ui = useSelector((state: RootState) => state.ui)
  const ntf = (...agrs: Parameters<typeof notify>) => dispatch(notify(...agrs))
  // Wallet instance
  const wallet = useSelector((state: RootState) => state.wallet)
  // DB instance
  const address = wallet.address
  const db = ssjs.isAddress(address)
    ? new PDB(address).createInstance(appName)
    : null
  // SenOS
  const senos = { ui, notify: ntf, wallet, db }
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
