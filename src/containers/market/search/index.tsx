import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Row, Col, Card, Input, Icon, Button } from 'sen-kit'

import universe from 'universe.json'
import SearchEngine from './engine'
import AppPanelInMarket from '../appPanelInMarket'
import './style.less'

let searching: ReturnType<typeof setTimeout>

const Search = () => {
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('')
  const [appNames, setAppNames] = useState<string[]>([])

  const { search } = useLocation()
  const history = useHistory()

  const onSearch = useCallback(
    async (keywords: string) => {
      const engine = new SearchEngine(universe)
      await setKeywords(keywords)
      await setLoading(true)
      clearTimeout(searching)
      if (!keywords) {
        await setAppNames([])
        await setLoading(false)
        return history.push('/market')
      }
      searching = setTimeout(async () => {
        const appNames = engine.search(keywords)
        await setAppNames(appNames)
        await setLoading(false)
        return window.scrollTo(0, 0)
      }, 1000)
    },
    [history],
  )

  const parseParams = useCallback(async () => {
    const params = new URLSearchParams(search) || {}
    const keywords = params.get('search') || ''
    await onSearch(keywords)
  }, [search, onSearch])

  const to = (appName = '') => {
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`)
  }

  useEffect(() => {
    parseParams()
  }, [parseParams])

  return (
    <Card
      className={`search-card ${keywords ? 'active' : 'passive'}`}
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Search"
            value={keywords}
            size="small"
            bordered={false}
            suffix={
              keywords ? (
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="close-circle-outline" />}
                  loading={loading}
                  onClick={() => onSearch('')}
                />
              ) : (
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="search-outline" />}
                  loading={loading}
                />
              )
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onSearch(e.target.value || '')
            }
          />
        </Col>
        {appNames.map((appName) => (
          <Col
            key={appName}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <AppPanelInMarket appName={appName} onClick={() => to(appName)} />
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default Search
