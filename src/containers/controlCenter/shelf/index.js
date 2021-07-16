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

import PDB from 'helpers/pdb';
import { loadApps, updateApps } from 'store/babysitter.reducer';
import { notify, toggleControlCenter } from 'store/ui.reducer';


class Shelf extends Component {

  componentDidMount() {
    this.getApps();
  }

  componentDidUpdate(prevProps) {
    const { wallet: { address: prevAddress } } = prevProps;
    const { wallet: { address } } = this.props;
    if (!isEqual(prevAddress, address)) this.getApps();
  }

  getApps = async () => {
    const { wallet: { address }, loadApps, notify } = this.props;
    if (!ssjs.isAddress(address)) return;
    const { error } = await loadApps();
    if (error) return await notify({ type: 'error', description: error.message });
  }


  uninstallApp = async (appName) => {
    const { wallet: { address }, babysitter: { apps }, updateApps } = this.props;
    const pdb = new PDB(address);
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await pdb.dropInstance(appName);
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
    const { updateApps } = this.props;
    return updateApps(newApps);
  }

  to = async (id) => {
    const { babysitter: { apps }, settings, history, toggleControlCenter } = this.props;
    if (settings) return;
    const page = apps.findIndex(row => row.includes(id));
    await toggleControlCenter(false);
    return history.push(`/home?page=${page}&appName=${id}`);
  }

  render() {
    const { settings, babysitter: { apps } } = this.props;

    return <Row gutter={[16, 16]}>
      <MultipleDnd
        ids={apps}
        Item={Item}
        itemPropsFunc={id => ({
          id,
          disabled: !settings,
          onClose: this.uninstallApp,
          onClick: () => this.to(id)
        })}
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
  notify, toggleControlCenter,
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