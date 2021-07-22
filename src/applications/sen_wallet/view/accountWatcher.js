import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { withRouter } from 'react-router-dom'
import ssjs from 'senswapjs'
import isEqual from 'react-fast-compare'

import { withSenOs } from 'helpers/senos'
import {
  getAccounts,
  upsetAccount,
} from '@/sen_wallet/controller/accounts.controller'

class AccountWatcher extends Component {
  componentDidMount() {
    this.fetchData()
    this.watchData()
  }

  componentDidUpdate(prevProps) {
    const {
      senos: {
        wallet: { address: prevAddress },
      },
    } = prevProps
    const {
      senos: {
        wallet: { address },
      },
    } = this.props
    if (!isEqual(prevAddress, address)) {
      this.fetchData()
      this.watchData()
    }
  }

  componentWillUnmount() {
    return this.unwatchData()
  }

  fetchData = async () => {
    const {
      senos: {
        wallet: { address },
        notify,
      },
      getAccounts,
    } = this.props
    if (!ssjs.isAddress(address)) return
    const { error } = await getAccounts(address)
    if (error)
      return await notify({ type: 'error', description: error.message })
  }

  watchData = () => {
    const {
      senos: {
        wallet: { address },
      },
      upsetAccount,
    } = this.props
    if (!ssjs.isAddress(address)) return this.unwatchData()
    if (this.watchId) return console.warn('Already watched')
    const callback = (er, re) => {
      if (er) return console.error(er)
      return upsetAccount(re)
    }
    const filters = [{ memcmp: { bytes: address, offset: 32 } }]
    this.watchId = window.senos.splt.watch(callback, filters)
  }

  unwatchData = async () => {
    try {
      await window.senos.splt.unwatch(this.watchId)
    } catch (er) {
      /* Nothing */
    }
    this.watchId = null
  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getAccounts,
      upsetAccount,
    },
    dispatch,
  )

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withSenOs(AccountWatcher)),
)
