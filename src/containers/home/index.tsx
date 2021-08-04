import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'

import { Row, Col, Affix } from '@senswap/sen-ui'
import DotPagination from 'components/dotPagination'
import { SortableDnD } from 'components/dnd'
import FooterAction from './footerAction'

import { DynamicApp } from 'helpers/loader'
import { RootState, RootDispatch } from 'store'
import { updateApps } from 'store/babysitter.reducer'
import { account } from '@senswap/sen-js'

const Home = () => {
  const [editable, setEditable] = useState<boolean>(false)

  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { search } = useLocation()
  const { apps } = useSelector((state: RootState) => state.babysitter)
  const { address: walletAddress } = useSelector(
    (state: RootState) => state.wallet,
  )

  const params = new URLSearchParams(search)
  const total = apps.length
  const page = Math.min(parseInt(params.get('page') || '0') || 0, total - 1)

  const to = (route = '#') => history.push(route)
  const onSort = (newAppNames: string[]) => {
    const newApps = [...apps]
    newApps[page] = newAppNames
    dispatch(updateApps(newApps))
  }
  const onEdit = (editable: boolean) => setEditable(editable)

  useEffect(() => {
    if (!account.isAddress(walletAddress)) return history.push('/welcome')
  }, [walletAddress, history])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify="center">
          <Col>
            <Affix>
              <DotPagination
                total={apps.length}
                page={page}
                onClick={(i) => to(`/home?page=${i}`)}
              />
            </Affix>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <SortableDnD
          ids={apps[page]}
          Item={DynamicApp}
          itemPropsFunc={(id) => ({ appName: id })}
          Wrapper={Row}
          wrapperProps={{ gutter: [16, 16] }}
          onChange={onSort}
          overlayStyle={{ width: '100%' }}
          disabled={!editable}
        />
      </Col>
      <Col span={24}>
        <FooterAction value={editable} onChange={onEdit} />
      </Col>
    </Row>
  )
}

export default Home
