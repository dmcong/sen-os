import {
  createContext,
  useContext,
  Children,
  cloneElement,
  Component,
  forwardRef,
  useCallback,
  useMemo,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'

import PDB from 'helpers/pdb'
import TokenProvider from 'helpers/tokenProvider'
import { RootState, RootDispatch } from 'store'
import { notify, State as UIState } from 'store/ui.reducer'
import { State as AccountsState } from 'store/accounts.reducer'
import { State as WalletState } from 'store/wallet.reducer'

const Context = createContext<SenOs>({} as SenOs)

export type SenOs = {
  senos: {
    ui: UIState
    notify: any
    wallet: WalletState
    accounts: AccountsState
    db: any
    tokenProvider: TokenProvider
  }
}

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
  const ntf = useCallback(
    (...agrs: Parameters<typeof notify>) => dispatch(notify(...agrs)),
    [dispatch],
  )
  // Wallet instance
  const wallet = useSelector((state: RootState) => state.wallet)
  // Accounts instance
  const accounts = useSelector((state: RootState) => state.accounts)
  // DB instance
  const db = useMemo(() => {
    const address = wallet.address
    return account.isAddress(address)
      ? new PDB(address).createInstance(appName)
      : null
  }, [wallet, appName])
  // Token Provider
  const tokenProvider = new TokenProvider()
  // SenOS
  const senos = { ui, notify: ntf, wallet, accounts, db, tokenProvider }
  // Context provider
  return (
    <Context.Provider value={{ senos } as SenOs}>{children}</Context.Provider>
  )
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
  return useContext<SenOs>(Context)
}

export { withSenOs, useSenOs }
export default SenOsProvider
