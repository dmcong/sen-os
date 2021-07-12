import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getCGK } from '@/sen_wallet/controller/cgk.controller';

import { Row, Col, Icon, Avatar, Typography } from 'sen-kit';

const Header = ({ mintAddress, ticket, symbol, name }) => {
  const [icon, setIcon] = useState('#');
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getCGK(ticket));
      if (error) return;
      const { [ticket]: { icon } } = payload;
      setIcon(icon);
    })();
  }, [ticket, dispatch])

  return <Row gutter={[16, 16]} align="middle" wrap={false}>
    <Col>
      <Avatar src={icon} size={40} >
        <Icon name="diamond-outline" />
      </Avatar >
    </Col>
    <Col>
      <Typography.Title level={5} style={{ margin: 0 }}>{name || mintAddress.substring(0, 6)}</Typography.Title>
      <Typography.Text type="secondary" style={{ margin: 0 }}>{symbol}</Typography.Text>
    </Col>
  </Row>
}

Header.defaultProps = {
  mintAddress: '',
  ticket: '',
  name: '',
  symbol: 'TOKEN',
}

Header.propTypes = {
  mintAddress: PropTypes.string,
  ticket: PropTypes.string,
  name: PropTypes.string,
  symbol: PropTypes.string,
}

export default Header;