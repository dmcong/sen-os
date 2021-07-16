import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getCGK } from '@/sen_wallet/controller/cgk.controller';

import { Row, Col, Icon, Avatar, Typography } from 'sen-kit';

const Header = ({ accountData, reset }) => {
  const [icon, setIcon] = useState('#');
  const dispatch = useDispatch();

  const { mint, ticket, symbol, name } = accountData;
  useEffect(() => {
    (async () => {
      const { error, payload } = await dispatch(getCGK(ticket));
      if (error) return;
      const { [ticket]: { icon } } = payload;
      setIcon(icon);
    })();
  }, [ticket, dispatch]);
  useEffect(() => {
    return () => setIcon('#');
  }, [reset]);

  return <Row gutter={[16, 16]} align="middle" wrap={false}>
    <Col>
      <Avatar src={icon} size={40} >
        <Icon name="diamond-outline" />
      </Avatar >
    </Col>
    <Col>
      <Typography.Title level={5} style={{ margin: 0 }}>{name || mint.substring(0, 6)}</Typography.Title>
      <Typography.Text type="secondary" style={{ margin: 0 }}>{symbol}</Typography.Text>
    </Col>
  </Row>
}

Header.defaultProps = {
  accountData: {},
  reset: false,
}

Header.propTypes = {
  accountData: PropTypes.object,
  reset: PropTypes.bool,
}

export default Header;