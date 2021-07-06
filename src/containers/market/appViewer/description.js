import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Button, Icon, Card } from 'sen-kit';
import Markdown from 'components/markdown';

import { dropPDB } from 'helpers/pdb';
import { updateApps } from 'store/babysitter.reducer';


class Description extends Component {

  uninstallApp = async () => {
    const { babysitter: { apps }, appName, updateApps } = this.props;
    if (!this.isInstalled()) return;
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await dropPDB(appName);
  }

  installApp = async () => {
    const { babysitter: { apps }, appName, updateApps } = this.props;
    if (this.isInstalled()) return;
    const newApps = apps.map(page => [...page]);
    newApps[newApps.length - 1].push(appName);
    return await updateApps(newApps);
  }

  isInstalled = () => {
    const { babysitter: { address, apps }, appName } = this.props;
    return ssjs.isAddress(address) && apps.flat().includes(appName);
  }

  render() {
    const { appName } = this.props;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        {this.isInstalled() ? <Button
          type="text"
          className="btnContained"
          icon={<Icon name="trash-outline" />}
          onClick={this.uninstallApp}
        >Uninstall</Button> : <Button
          type="primary"
          icon={<Icon name="cloud-download-outline" />}
          onClick={this.installApp}
        >Install</Button>}
      </Col>
      <Col span={24}>
        <Card>
          <Markdown appName={appName} />
        </Card>
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

Description.propTypes = {
  appName: PropTypes.string.isRequired,
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Description));