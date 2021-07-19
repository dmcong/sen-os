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
import { RootState, Dispatch } from 'store'
import { notify, State as UIState } from 'store/ui.reducer'
import { State as WalletState } from 'store/wallet.reducer'

const Context = createContext({})

const SenOsProvider = ({
  children,
  appName,
}: {
  children: JSX.Element
  appName: string
}) => {
  const dispatch = useDispatch()
  let senos:
    | {
        ui: UIState
        notify: Dispatch
        db: any
        wallet: WalletState
      }
    | any = {}
  // UI instance
  senos.ui = useSelector((state: RootState) => state.ui)
  senos.notify = (agrs: Parameters<typeof notify>[0]) => dispatch(notify(agrs))
  // Wallet instance
  senos.wallet = useSelector((state: RootState) => state.wallet)
  // DB instance
  const address = senos.wallet?.address
  const pdb = ssjs.isAddress(address) ? new PDB(address) : null
  senos.db = pdb?.createInstance(appName)
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
