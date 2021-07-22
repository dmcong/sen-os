import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { withRouter } from 'react-router-dom'
import isEqual from 'react-fast-compare'
import ssjs from 'senswapjs'

import { Row, Col } from 'sen-kit'
import LazyLoad from 'react-lazyload'
import AccountWatcher from './accountWatcher'
import WalletInfo from './walletInfo'
import Search from './search'
import AccountCard from './accountCard'
import Settings from './settings'
import AccountActions from './accountActions'
import SolCard from './solCard'

import { withSenOs } from 'helpers/senos'
import mintConfig from '@/sen_wallet/config/mint.config'

class View extends Component {
  constructor() {
    super()

    this.state = {
      orderedAccounts: [],
      settings: {
        hiddenZeros: false,
      },
      accountIndex: -1,
    }
  }

  get pseudoSolAccount() {
    const {
      senos: {
        wallet: { address, lamports },
      },
    } = this.props
    return {
      mint: ssjs.DEFAULT_EMPTY_ADDRESS,
      amount: lamports,
      address,
      ticket: 'solana',
      symbol: 'SOL',
      name: 'Solana',
    }
  }

  componentDidMount() {
    this.reset()
  }

  componentDidUpdate(prevProps) {
    const { accounts: prevAccounts } = prevProps
    const { accounts } = this.props
    if (!isEqual(prevAccounts, accounts)) this.reset()
  }

  reset = () => {
    const { accounts } = this.props
    return this.sort(Object.keys(accounts))
  }

  sort = async (accountAddresses) => {
    const { accounts } = this.props
    const mintAddresses = mintConfig.map(({ address }) => address)
    let priority = []
    let rest = []
    // Prioritized mints
    accountAddresses.forEach((address) => {
      const data = accounts[address]
      const { mint } = data
      const index = mintAddresses.indexOf(mint)
      if (index < 0) return rest.push({ ...data, address })
      const { ticket, symbol, name } = mintConfig[index]
      return priority.push({ ...data, address, ticket, symbol, name })
    })
    // Unknown mints
    const orderedAccounts = priority.concat(rest)
    return this.setState({ orderedAccounts })
  }

  onSearch = (accountAddress) => {
    if (!accountAddress) return this.reset()
    return this.sort(accountAddress)
  }

  render() {
    const { orderedAccounts, settings, accountIndex } = this.state
    const { hiddenZeros } = settings

    return (
      <Row gutter={[16, 16]}>
        <AccountWatcher />
        <Col span={24}>
          <WalletInfo />
        </Col>
        <Col span={24} />
        <Col span={24}>
          <Row gutter={[16, 12]} justify="center">
            <Col span={24}>
              <Row gutter={[8, 8]} align="middle">
                <Col flex="auto">
                  <Search onChange={this.onSearch} />
                </Col>
                <Col>
                  <Settings
                    value={settings}
                    onChange={(value) => this.setState({ settings: value })}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <SolCard />
            </Col>
            {orderedAccounts.map((accountData, i) => {
              const { amount, address } = accountData
              if (!amount && hiddenZeros) return null
              return (
                <Col span={24} key={address + i /* Trick to clear memo */}>
                  <LazyLoad height={76} overflow>
                    <AccountCard
                      data={accountData}
                      onClick={() => this.setState({ accountIndex: i })}
                    />
                  </LazyLoad>
                </Col>
              )
            })}
            <AccountActions
              visible={accountIndex >= 0}
              onClose={() => this.setState({ accountIndex: -1 })}
              accountData={orderedAccounts[accountIndex]}
            />
          </Row>
        </Col>
        <Col span={24} />
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withSenOs(View)),
)
