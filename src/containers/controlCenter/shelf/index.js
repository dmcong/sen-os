import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import isEqual from 'react-fast-compare';

import { Row, Col } from 'sen-kit';
import DraggbleLogo from './draggableLogo';
import Spot from './spot';

import { dropPDB } from 'helpers/pdb';
import { loadApps, updateApps } from 'store/babysitter.reducer';

const DEFAULT_ITEM = {
  current: { index: -1, page: -1 },
  next: { index: -1, page: -1 },
}

class Shelf extends Component {
  constructor() {
    super();

    this.state = {
      draftItem: { ...DEFAULT_ITEM },
    }
  }

  componentDidMount() {
    const { wallet: { address }, loadApps } = this.props;
    loadApps(address);
  }

  componentDidUpdate(prevProps) {
    const { wallet: { address: prevAddress } } = prevProps;
    const { wallet: { address }, loadApps } = this.props;
    if (!isEqual(prevAddress, address)) loadApps(address);
  }

  uninstallApp = async (appName) => {
    const { babysitter: { apps }, updateApps } = this.props;
    const newApps = apps.filter(name => name !== appName);
    await updateApps(newApps);
    return await dropPDB(appName);
  }

  onHover = (item) => {
    const { babysitter: { apps } } = this.props;
    const draftItem = JSON.parse(JSON.stringify(item));
    let { next: { index } } = draftItem;
    index = Math.min(Math.max(index, 0), apps.length - 1);
    draftItem.next.index = index;
    return this.setState({ draftItem });
  }

  onDrop = () => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const { draftItem } = this.state;
    const { current: { index: oldIndex }, next: { index: newIndex } } = draftItem;
    const apps = [...prevApps];
    apps.splice(newIndex, 0, apps.splice(oldIndex, 1)[0]);
    return this.setState({ apps, draftItem: { ...DEFAULT_ITEM } }, () => {
      return updateApps(apps);
    });
  }

  render() {
    const { ui: { touchable }, settings, babysitter: { apps } } = this.props;
    const { draftItem: { current: { index: oldIndex }, next: { index: newIndex } } } = this.state;

    return <DndProvider backend={touchable ? TouchBackend : HTML5Backend}>
      <Row gutter={[16, 16]}>
        {apps.map((appName, i) => <Fragment key={i}>
          {newIndex === i && oldIndex > newIndex ? <Spot /> : null}
          <Col>
            <DraggbleLogo
              page={0}
              index={i}
              name={appName}
              onClose={() => this.uninstallApp(appName)}
              onHover={this.onHover}
              onDrop={this.onDrop}
              disabled={!settings}
            />
          </Col>
          {newIndex === i && oldIndex < newIndex ? <Spot /> : null}
        </Fragment>)}
      </Row>
    </DndProvider>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
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