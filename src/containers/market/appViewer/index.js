import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Button, Icon } from 'sen-kit';
import HeroPanel from './heroPanel';
import Description from './description';

import { updateApps } from 'store/babysitter.reducer';


class AppViewer extends Component {

  back = () => {
    const { history } = this.props;
    return history.goBack();
  }

  parseParams = () => {
    const { match: { params } } = this.props;
    const appName = params.appName || '';
    return { appName }
  }

  installApp = async (appName) => {
    const { babysitter: { address, apps }, updateApps } = this.props;
    if (!ssjs.isAddress(address) || apps.flat().includes(appName)) return;
    const newApps = apps.map(page => [...page]);
    newApps[newApps.length - 1].push(appName);
    return await updateApps(newApps);
  }

  render() {
    const { appName } = this.parseParams();

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button
          type="text"
          size="large"
          icon={<Icon name="arrow-back-outline" />}
          onClick={this.back}
        >Back</Button>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <HeroPanel appName={appName} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 16 }}>
        <Description appName={appName} />
      </Col>
    </Row >
  }
}

const mapStateToProps = state => ({
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppViewer));