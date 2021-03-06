import React, { createContext, useContext, Children, cloneElement, Component, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ssjs from 'senswapjs';

import PDB from 'helpers/pdb';
import { notify } from 'store/ui.reducer';


const Context = createContext({});

const SenOsProvider = ({ children, appName }) => {
  const dispatch = useDispatch();
  let senos = {}
  // UI instance
  senos.ui = useSelector(state => state.ui);
  senos.notify = (...agrs) => dispatch(notify(...agrs));
  // Wallet instance
  senos.wallet = useSelector(state => state.wallet);
  // DB instance
  const address = senos.wallet?.address;
  const pdb = ssjs.isAddress(address) ? new PDB(address) : null;
  senos.db = pdb?.createInstance(appName);
  // Context provider
  return <Context.Provider value={{ senos }}>
    {children}
  </Context.Provider>
}

const SenOsComsumer = ({ children }) => {
  return <Context.Consumer>
    {value => Children.map(children, child => cloneElement(child, { ...value }))}
  </Context.Consumer>
}

const withSenOs = (WrappedComponent) => {
  class HOC extends Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <SenOsComsumer>
        <WrappedComponent ref={forwardedRef} {...rest} />
      </SenOsComsumer>
    }
  }
  return forwardRef((props, ref) => <HOC {...props} ref={ref} />);
}

const useSenOs = () => {
  return useContext(Context);
}

export { withSenOs, useSenOs }
export default SenOsProvider;