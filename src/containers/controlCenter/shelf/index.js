import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import isEqual from 'react-fast-compare';

import { Row, Col } from 'sen-kit';
import DraggbleLogo from './draggableLogo';
import Spot from './spot';

import { dropPDB } from 'helpers/pdb';
import { updateApps } from 'store/babysitter.reducer';


class Shelf extends Component {
  constructor() {
    super();

    this.state = {
      draftIndex: [-1, -1],
      apps: []
    }
  }

  componentDidMount() {
    const { babysitter: { apps } } = this.props;
    return this.setState({ apps });
  }

  componentDidUpdate(prevProps) {
    const { babysitter: { apps: prevApps } } = prevProps;
    const { babysitter: { apps } } = this.props;
    if (!isEqual(prevApps, apps)) return this.setState({ apps });
  }

  uninstallApp = async (appName) => {
    const { babysitter: { apps }, updateApps } = this.props;
    const newApps = apps.filter(name => name !== appName);
    await updateApps(newApps);
    return await dropPDB(appName);
  }

  onHover = ({ current: { index: oldIndex }, next: { index: newIndex } }) => {
    const { apps } = this.state;
    newIndex = Math.min(Math.max(newIndex, 0), apps.length - 1);
    return this.setState({ draftIndex: [oldIndex, newIndex] });
  }

  onDrop = ({ current: { index: oldIndex }, next: { index: newIndex } }) => {
    const { updateApps } = this.props;
    const { apps: prevApps } = this.state;
    newIndex = Math.min(Math.max(newIndex, 0), prevApps.length - 1);
    const apps = [...prevApps];
    apps.splice(newIndex, 0, apps.splice(oldIndex, 1)[0]);
    return this.setState({ apps, draftIndex: [-1, -1] }, () => {
      return updateApps(apps);
    });
  }

  render() {
    const { apps, draftIndex: [oldIndex, newIndex] } = this.state;
    return <DndProvider backend={HTML5Backend}>
      <Row gutter={[16, 16]}>
        {apps.map((appName, i) => <Fragment key={i}>
          {newIndex === i && oldIndex > newIndex ? <Spot /> : null}
          <Col>
            <DraggbleLogo
              page={0}
              index={i}
              name={appName}
              onClick={() => this.uninstallApp(appName)}
              onHover={this.onHover}
              onDrop={this.onDrop}
            />
          </Col>
          {newIndex === i && oldIndex < newIndex ? <Spot /> : null}
        </Fragment>)}
      </Row>
    </DndProvider>
  }
}

const mapStateToProps = state => ({
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateApps
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Shelf));