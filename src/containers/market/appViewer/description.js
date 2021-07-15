import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Button, Icon, Card } from 'sen-kit';
import Markdown from 'components/markdown';

import PDB from 'helpers/pdb';
import { updateApps } from 'store/babysitter.reducer';


class Description extends Component {

  uninstallApp = async () => {
    const { wallet: { address }, babysitter: { apps }, appName, updateApps } = this.props;
    const pdb = new PDB(address);
    if (!this.isInstalled()) return;
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await pdb.dropInstance(appName);
  }

  installApp = async () => {
    const { babysitter: { apps }, appName, updateApps } = this.props;
    if (this.isInstalled()) return;
    const newApps = apps.map(page => [...page]);
    newApps[newApps.length - 1].push(appName);
    return await updateApps(newApps);
  }

  toApp = () => {
    const { history, babysitter: { apps }, appName } = this.props;
    const page = apps.findIndex(row => row.includes(appName));
    return history.push(`/home?page=${page}&appName=${appName}`);
  }

  isInstalled = () => {
    const { wallet: { address }, babysitter: { apps }, appName } = this.props;
    return ssjs.isAddress(address) && apps.flat().includes(appName);
  }

  render() {
    const { appName } = this.props;

    return <Row gutter={[16, 16]} justify="space-between">
      <Col>
        {this.isInstalled() ? <Button
          type="primary"
          onClick={this.toApp}
        >Open</Button> : <Button
          type="primary"
          icon={<Icon name="cloud-download-outline" />}
          onClick={this.installApp}
        >Install</Button>}
      </Col>
      <Col>
        {this.isInstalled() ? <Button
          type="text"
          className="contained"
          icon={<Icon name="trash-outline" />}
          onClick={this.uninstallApp}
        >Uninstall</Button> : null}
      </Col>
      <Col span={24}>
        <Card className="shadowed">
          <Markdown appName={appName} />
        </Card>
      </Col>
    </Row >
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
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