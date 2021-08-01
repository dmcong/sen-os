import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Card, Input, Icon, Button } from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'
import { SenTradeMark } from 'components/trademark'

const KEYSIZE = 3

const Search = ({ onChange }) => {
  const [keyword, setKeyword] = useState('')
  const accounts = useSelector((state) => state.accounts)
  const {
    senos: { tokenProvider },
  } = useSenOs()

  useEffect(() => {
    ;(async () => {
      if (!keyword || keyword.length < KEYSIZE) return onChange(null)
      const accountData = Object.keys(accounts).map(
        (address) => accounts[address],
      )
      const data = (await tokenProvider.find(keyword))
        .map((mintData) => {
          const { address: mintAddress } = mintData
          const acc = accountData.find(({ mint }) => mint === mintAddress)
          if (!acc) return {}
          return { ...mintData, ...acc }
        })
        .filter(({ address }) => account.isAddress(address))
      return onChange(data)
    })()
  }, [keyword, accounts, onChange, tokenProvider])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <Input
            placeholder="Search"
            value={keyword}
            size="small"
            bordered={false}
            prefix={
              <Button
                type="text"
                style={{ marginLeft: -7 }}
                size="small"
                onClick={keyword ? () => setKeyword('') : () => {}}
                icon={
                  <Icon name={keyword ? 'close-outline' : 'search-outline'} />
                }
              />
            }
            suffix={<SenTradeMark />}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Card>
      </Col>
    </Row>
  )
}

Search.defaultProps = {
  onChange: () => {},
}

Search.propTypes = {
  onChange: PropTypes.func,
}

export default Search
