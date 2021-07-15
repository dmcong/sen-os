import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col, Typography, Widget, Button, Icon } from 'sen-kit';

import PDB from 'helpers/pdb';
import { DynamicLogo } from 'helpers/loader';
import { updateApps } from 'store/babysitter.reducer';


/**
 * Error Boundary
 */
class ErrorBoundary extends Component {
  constructor() {
    super();

    this.state = {
      error: '',
      info: '',
    }
  }

  componentDidCatch(error, info) {
    return this.setState({ error, info });
  }

  uninstallApp = async () => {
    const { wallet: { address }, babysitter: { apps }, updateApps, appName } = this.props;
    const pdb = new PDB(address);
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await pdb.dropInstance(appName);
  }

  support = () => {
    const { email, appName } = this.props;
    return window.open(`mailto:${email}?subject=${appName} has failed`, '_blank');
  }

  render() {
    const { error } = this.state;
    const { appName, version, children } = this.props;

    if (error || !children) return <Widget type="glass">
      <Row gutter={[8, 8]} style={{ height: '100%' }} align="middle" justify="center" >
        <Col>
          <DynamicLogo name={appName} title={false} />
        </Col>
        <Col span={24}>
          <Typography.Title level={4} align="center">{appName}</Typography.Title>
          <p align="center">Version {version}</p>
        </Col>
        <Col span={24}>
          <p align="center">Oops! The application can't load properly</p>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            icon={<Icon name="trash-outline" />}
            onClick={this.uninstallApp}
            block
          >Uninstall</Button>
        </Col>
        <Col span={12}>
          <Button
            type="text"
            icon={<Icon name="help-buoy-outline" />}
            onClick={this.support}
            block
          >Support</Button>
        </Col>
      </Row>
    </Widget>
    return children;
  }
}

ErrorBoundary.propTypes = {
  appName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  wallet: state.wallet,
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBoundary));