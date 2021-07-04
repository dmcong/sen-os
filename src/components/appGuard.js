import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col, Widget, Typography, Button, Icon } from 'sen-kit';

import { dropPDB } from 'helpers/pdb';
import { DynamicLogo } from 'helpers/loader';
import { updateApps } from 'store/babysitter.reducer';


/**
 * Removed Application
 */
const AppGuard = ({ name }) => {
  const { apps } = useSelector(state => state.babysitter);
  const dispatch = useDispatch();

  const uninstallApp = useCallback(async () => {
    const newApps = apps.map(page => page.filter(appName => appName !== name));
    await dispatch(updateApps(newApps));
    return await dropPDB(name);
  }, [dispatch, name, apps]);

  return <Widget type="glass">
    <Row gutter={[8, 8]} style={{ height: '100%' }} align="middle" justify="center">
      <Col>
        <DynamicLogo name={name} title={false} />
      </Col>
      <Col span={24}>
        <Typography.Title level={4} align="center">{name}</Typography.Title>
      </Col>
      <Col span={24}>
        <p align="center">Oops! The application possibly had been removed from the market</p>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<Icon name="trash-outline" />}
          onClick={uninstallApp}
        >Remove</Button>
      </Col>
    </Row>
  </Widget>
}

AppGuard.propTypes = {
  name: PropTypes.string.isRequired
}

export default AppGuard;