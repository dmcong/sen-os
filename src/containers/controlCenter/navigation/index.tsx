import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Brand, Button, Icon, Space } from '@senswap/sen-ui'
import Wallet from '../wallet'

import { RootDispatch, RootState } from 'store'
import { toggleControlCenter } from 'store/ui.reducer'

const Navigation = () => {
  const dispatch = useDispatch<RootDispatch>()
  const { infix, visibleControlCenter } = useSelector(
    (state: RootState) => state.ui,
  )
  const { address } = useSelector((state: RootState) => state.wallet)
  const history = useHistory()

  const to = async (route = '#') => {
    await dispatch(toggleControlCenter(false))
    return history.push(route)
  }

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Space size={infix === 'xs' ? 'small' : 'middle'}>
          <span style={{ marginLeft: -7 }}>
            <Brand size={32} lite={infix === 'xs'} />
          </span>
          <Button
            type="text"
            className="contained"
            onClick={() => to('/home')}
            icon={<Icon name="ellipse-outline" />}
          />
          <Button
            type="text"
            className="contained"
            onClick={() => dispatch(toggleControlCenter(!visibleControlCenter))}
            icon={
              <Icon
                name={visibleControlCenter ? 'close-outline' : 'grid-outline'}
              />
            }
            disabled={!account.isAddress(address)}
          />
          <Button
            type="text"
            className="contained"
            onClick={() => to('/market')}
            icon={<Icon name="storefront-outline" />}
          />
        </Space>
      </Col>
      <Col>
        <Wallet />
      </Col>
    </Row>
  )
}

export default Navigation
