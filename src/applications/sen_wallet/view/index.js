import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col } from 'sen-kit'
import LazyLoad from 'react-lazyload'
import AccountWatcher from './accountWatcher'
import WalletInfo from './walletInfo'
import Search from './search'
import AccountCard from './accountCard'
import Settings from './settings'
import AccountActions from './accountActions'
import SolCard from './solCard'

import { useSenOs } from 'helpers/senos'

const View = () => {
  const [orderedAccounts, setOrderedAccounts] = useState([])
  const [searchedAccounts, setSearchedAccounts] = useState(null)
  const [settings, setSettings] = useState({ hiddenZeros: false })
  const [accountIndex, setAccountIndex] = useState(-1)
  const {
    senos: { tokenProvider },
  } = useSenOs()
  const accounts = useSelector((state) => state.accounts)

  const sort = useCallback(async () => {
    const priority = []
    const rest = []
    for (const address of Object.keys(accounts)) {
      const accountData = accounts[address]
      const { mint } = accountData
      const mintData = await tokenProvider.findByAddress(mint)
      if (mintData) priority.push({ ...mintData, ...accountData, address })
      else rest.push({ ...mintData, ...accountData, address })
    }
    // Unknown mints
    const orderedAccounts = priority.concat(rest)
    return setOrderedAccounts(orderedAccounts)
  }, [accounts, tokenProvider])

  useEffect(() => {
    sort()
  }, [sort])

  const { hiddenZeros } = settings
  const renderedAccounts = searchedAccounts ? searchedAccounts : orderedAccounts
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
                <Search onChange={setSearchedAccounts} />
              </Col>
              <Col>
                <Settings value={settings} onChange={setSettings} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <SolCard />
          </Col>
          {renderedAccounts.map((accountData, i) => {
            const { amount, address } = accountData
            if (!amount && hiddenZeros) return null
            return (
              <Col span={24} key={address + i /* Trick to clear memo */}>
                <LazyLoad height={76} overflow>
                  <AccountCard
                    data={accountData}
                    onClick={() => setAccountIndex(i)}
                  />
                </LazyLoad>
              </Col>
            )
          })}
          <AccountActions
            visible={accountIndex >= 0}
            onClose={() => setAccountIndex(-1)}
            accountData={renderedAccounts[accountIndex]}
          />
        </Row>
      </Col>
      <Col span={24} />
    </Row>
  )
}

export default View
