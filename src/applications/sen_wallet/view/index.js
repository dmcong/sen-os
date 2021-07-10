import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import ssjs from 'senswapjs';

import { Row, Col } from 'sen-kit';
import LazyLoad from 'react-lazyload';
import AccountWatcher from './accountWatcher';
import AccountInfo from './accountInfo';
import Search from './search';
import AccountCard from './accountCard';
import Settings from './settings';
import Transfer from './transfer';

import { withSenOs } from 'helpers/senos';
import mintConfig from '@/sen_wallet/config/mint.config';
import solConfig from '@/sen_wallet/config/sol.config';


/**
 * Setup env
 */
const { spltAddress, splataAddress, node } = solConfig;
window.senos = window.senos || {}
window.senos.splt = new ssjs.SPLT(spltAddress, splataAddress, node);


class View extends Component {
  constructor() {
    super();

    this.state = {
      orderedAccounts: [],
      settings: {
        hiddenZeros: false
      },
      accountIndex: -1,
    }
  }

  componentDidMount() {
    const { accounts } = this.props;
    this.sort(Object.keys(accounts));
  }

  componentDidUpdate(prevProps) {
    const { accounts: prevAccounts } = prevProps;
    const { accounts } = this.props;
    if (!isEqual(prevAccounts, accounts)) this.sort(Object.keys(accounts));
  }

  sort = (accountAddresses) => {
    const { accounts } = this.props;
    const mintAddresses = mintConfig.map(({ address }) => address);
    let priority = [];
    let rest = [];
    accountAddresses.forEach(address => {
      const data = accounts[address];
      const { mint } = data;
      const index = mintAddresses.indexOf(mint);
      if (index < 0) return rest.push({ address, ...data });
      const { ticket, symbol, name, decimals } = mintConfig[index];
      return priority.push({ ...data, address, ticket, symbol, name, decimals });
    });
    const orderedAccounts = priority.concat(rest);
    return this.setState({ orderedAccounts });
  }

  onSearch = (accountAddress) => {
    const { accounts } = this.props;
    if (!accountAddress) return this.sort(Object.keys(accounts));
    return this.sort(accountAddress);
  }

  onSettings = (settings) => {
    return this.setState({ settings });
  }

  onCard = (accountIndex) => {
    return this.setState({ accountIndex });
  }

  onClose = () => {
    return this.setState({ accountIndex: -1 });
  }

  render() {
    const { orderedAccounts, settings, accountIndex } = this.state;
    const { hiddenZeros } = settings;

    return <Row gutter={[24, 24]}>
      <AccountWatcher />
      <Col span={24}>
        <AccountInfo />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col span={24}>
            <Row gutter={[8, 8]} align="middle">
              <Col>
                <Settings value={settings} onChange={this.onSettings} />
              </Col>
              <Col flex="auto">
                <Search onChange={this.onSearch} />
              </Col>
            </Row>
          </Col>
          {orderedAccounts.map((accountData, i) => {
            const { amount } = accountData;
            if (!amount && hiddenZeros) return null;
            return <Col span={24} key={i}>
              <LazyLoad height={76} overflow>
                <AccountCard data={accountData} onClick={() => this.onCard(i)} />
              </LazyLoad>
            </Col>
          })}
          <Transfer
            visible={accountIndex >= 0}
            onClose={this.onClose}
            accountData={orderedAccounts[accountIndex]}
          />
        </Row>
      </Col>
      <Col span={24} />
    </Row>
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withSenOs(View)));