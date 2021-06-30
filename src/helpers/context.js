import React, { createContext, Children, cloneElement, Component, forwardRef } from 'react';

const Context = createContext({});

const SenOsProvider = ({ children, ...others }) => {
  return <Context.Provider value={{ ...others }}>
    {children}
  </Context.Provider>
}

const SenOsComsumer = ({ children }) => {
  return <Context.Consumer>
    {ctx => Children.map(children, child => cloneElement(child, { ...ctx }))}
  </Context.Consumer>
}

const withSenOs = (WrappedComponent) => {
  class HOC extends Component {
    render() {
      const { forwardedRef, ...others } = this.props;
      return <SenOsComsumer>
        <WrappedComponent ref={forwardedRef} {...others} />
      </SenOsComsumer>
    }
  }
  return forwardRef((props, ref) => <HOC {...props} ref={ref} />);
}

export { SenOsProvider, SenOsComsumer, withSenOs }
export default Context;