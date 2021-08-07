import React, { useState } from 'react'
import { Row, Col, Card, Input, Button, Icon } from '@senswap/sen-ui'
import { SenTradeMark } from 'components/trademark'
import { useSelector } from 'react-redux'
import JsonViewer from '@/micodb/components/JsonViewer'

export default function Documents(props) {
  const { collectionName } = props
  const [search, setSearch] = useState('')
  const documents = useSelector(
    (state) => state.collection[collectionName]?.documents || [],
  )
  const [docFilter, setDocFilter] = useState([...documents])

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      try {
        const filter = JSON.parse(search)
        const newDocFilter = []
        for (const doc of documents) {
          let isCheck = true
          for (const key in filter) {
            const value = filter[key]
            if (doc[key] !== value) isCheck = false
          }
          if (isCheck) newDocFilter.push(doc)
        }
        setDocFilter(newDocFilter)
      } catch (error) {
        setDocFilter([...documents])
      }
    }
  }
  return (
    <React.Fragment>
      <Row gutter={[16, 16]} style={{ marginBottom: 14 }}>
        <Col span={24}>
          <Card bodyStyle={{ padding: 8 }} bordered={false}>
            <Input
              placeholder="Search"
              value={search}
              size="small"
              bordered={false}
              prefix={
                <Button
                  type="text"
                  style={{ marginLeft: -7 }}
                  size="small"
                  onClick={search ? () => setSearch('') : undefined}
                  icon={<Icon name={search ? 'close-outline' : 'search'} />}
                />
              }
              suffix={<SenTradeMark style={{ marginRight: -7 }} />}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e)}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ overflow: 'auto', maxHeight: '60vh' }}>
        <Col span={24}>
          {docFilter.map((doc) => {
            return <JsonViewer jsonData={doc}></JsonViewer>
          })}
        </Col>
      </Row>
    </React.Fragment>
  )
}
