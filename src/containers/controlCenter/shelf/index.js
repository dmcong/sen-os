import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import ssjs from 'senswapjs';

import { Row, Col, Button, Icon } from 'sen-kit';
import { MultipleDnd } from 'components/dnd';
import Container from './container';
import Item from './item';

import { dropInstance } from 'helpers/pdb';
import { loadApps, updateApps } from 'store/babysitter.reducer';
import { notify } from 'store/ui.reducer';


class Shelf extends Component {
  constructor() {
    super();

    this.state = {
      apps: [],
      editable: false,
    }
  }

  componentDidMount() {
    this.getApps();
  }

  componentDidUpdate(prevProps, prevState) {
    const { wallet: { address: prevAddress }, babysitter: { apps: prevApps } } = prevProps;
    const { wallet: { address }, babysitter: { apps } } = this.props;
    if (!isEqual(prevAddress, address)) this.getApps();
    if (!isEqual(prevApps, apps)) this.setState({ apps });
    const { apps: prevAppsInState } = prevState;
    const { apps: appsInState } = this.state;
    if (!isEqual(prevAppsInState, appsInState)) this.setApps();
  }

  getApps = async () => {
    const { wallet: { address }, loadApps, notify } = this.props;
    if (!ssjs.isAddress(address)) return;
    const { error, payload } = await loadApps();
    if (error) return await notify({ type: 'error', description: error.message });
    const { apps } = payload;
    return this.setState({ apps });
  }

  setApps = async () => {
    const { wallet: { address }, updateApps, notify } = this.props;
    const { apps } = this.state;
    if (!ssjs.isAddress(address)) return;
    const { error } = await updateApps(apps);
    if (error) return await notify({ type: 'error', description: error.message });
  }

  uninstallApp = async (appName) => {
    const { babysitter: { apps }, updateApps } = this.props;
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await dropInstance(appName);
  }

  onAddPage = () => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const apps = [...prevApps];
    apps.push([]);
    return updateApps(apps);
  }

  onRemovePage = (index) => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const apps = prevApps.filter((row, i) => row.length || i !== index);
    return updateApps(apps);
  }

  onSort = (newApps) => {
    return this.setState({ apps: newApps });
  }

  render() {
    const { settings } = this.props;
    const { apps } = this.state;

    return <Row gutter={[16, 16]}>
      <MultipleDnd
        ids={apps}
        Item={Item}
        itemPropsFunc={id => ({ disabled: !settings, id, onClose: this.uninstallApp })}
        Container={Container}
        containerPropsFunc={index => ({ disabled: !settings, index, onClose: this.onRemovePage })}
        disabled={!settings}
        onChange={this.onSort}
        overlayStyle={{ opacity: 0.5 }}
      />
      {/* I want to add more */}
      {settings ? <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col>
            <Button
              type="text"
              className="contained"
              icon={<Icon name="add-outline" />}
              onClick={this.onAddPage}
            />
          </Col>
        </Row>
      </Col> : null}
    </Row >
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  notify,
  loadApps, updateApps
}, dispatch);

PropTypes.defaultProps = {
  settings: false
}

PropTypes.propTypes = {
  settings: PropTypes.bool
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Shelf));