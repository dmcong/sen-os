import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import isEqual from 'react-fast-compare';

import { Row, Col, Button, Icon } from 'sen-kit';
import DraggbleLogo from './draggableLogo';
import DroppableZone from './droppableZone';
import { MultipleProvider, MultipleContainer, MultipleWrapper } from 'components/dnd';

import { dropPDB } from 'helpers/pdb';
import { DynamicLogo } from 'helpers/loader';
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
    const newApps = apps.map(page => page.filter(name => name !== appName));
    await updateApps(newApps);
    return await dropPDB(appName);
  }

  onHover = (item) => {
    const { babysitter: { apps } } = this.props;
    const draftItem = JSON.parse(JSON.stringify(item));
    let { current: { page: oldPage }, next: { index, page: newPage } } = draftItem;
    const sign = oldPage === newPage ? 1 : 0;
    index = Math.max(Math.min(index, apps[newPage].length - sign), 0);
    draftItem.next.index = index;
    return this.setState({ draftItem });
  }

  onDrop = () => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const { draftItem: {
      current: { index: oldIndex, page: oldPage },
      next: { index: newIndex, page: newPage } }
    } = this.state;
    let apps = prevApps.map(row => [...row]);
    if (oldPage === newPage) {
      let row = apps[oldPage];
      row.splice(newIndex, 0, row.splice(oldIndex, 1)[0]);
      apps[oldPage] = row;
    }
    else {
      const appName = apps[oldPage][oldIndex];
      apps[oldPage] = apps[oldPage].filter(name => name !== appName);
      apps[newPage].splice(newIndex, 0, appName);
    }
    return this.setState({ draftItem: { ...DEFAULT_ITEM } }, () => {
      return updateApps(apps);
    });
  }

  onAddPage = () => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const apps = [...prevApps];
    apps.push([]);
    return updateApps(apps);
  }

  onRemovePage = (page) => {
    const { babysitter: { apps: prevApps }, updateApps } = this.props;
    const apps = prevApps.filter((row, i) => row.length || i !== page);
    return updateApps(apps);
  }

  render() {
    const { ui: { touchable }, settings, babysitter: { apps } } = this.props;

    return <DndProvider backend={touchable ? TouchBackend : HTML5Backend}>
      <Row gutter={[16, 16]}>

        <MultipleProvider>
          {apps.map((row, page) => <Col
            key={page}
            span={24}
            className={`zone ${settings ? 'active' : 'passive'}`}
          >
            <MultipleContainer>
              {row.map(appName => <MultipleWrapper id={appName} key={appName}>
                <Col>
                  <DynamicLogo name={appName} />
                </Col>
              </MultipleWrapper>)}
            </MultipleContainer>
          </Col>)}
        </MultipleProvider>

        {apps.map((row, page) => <Col
          key={page}
          span={24}
          className={`zone ${settings ? 'active' : 'passive'}`}
        >
          <Row gutter={[16, 16]}>
            {row.map((appName, index) => <Col key={index}>
              <DraggbleLogo
                page={page}
                index={index}
                name={appName}
                onClose={() => this.uninstallApp(appName)}
                onHover={this.onHover}
                onDrop={this.onDrop}
                disabled={!settings}
              />
            </Col>)}
            {settings ? <Col flex="auto">
              <DroppableZone
                index={row.length}
                page={page}
                onClose={() => this.onRemovePage(page)}
                onHover={this.onHover}
                disabled={!settings}
              />
            </Col> : null}
          </Row>
        </Col>)}
        {/* I want to add more */}
        {settings ? <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col>
              <Button
                type="text"
                className="btnContained"
                icon={<Icon name="add-outline" />}
                onClick={this.onAddPage}
              />
            </Col>
          </Row>
        </Col> : null}
      </Row>
    </DndProvider >
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