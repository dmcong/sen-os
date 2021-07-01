import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col } from 'sen-kit';

import { DynamicLogo } from 'helpers/loader';
import { dropPDB } from 'helpers/pdb';
import { updateApps } from 'store/installer.reducer';


class MyApplications extends Component {

  uninstallApp = async (appName) => {
    const { installer: { apps }, updateApps } = this.props;
    const newApps = apps.filter(name => name !== appName);
    await updateApps(newApps);
    return await dropPDB(appName);
  }

  render() {
    const { installer: { apps } } = this.props;

    return <Row gutter={[16, 16]}>
      {apps.map(appName => <Col key={appName}>
        <DynamicLogo name={appName} onClick={() => this.uninstallApp(appName)} />
      </Col>)}
    </Row>
  }
}

const mapStateToProps = state => ({
  installer: state.installer,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplications));