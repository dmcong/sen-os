import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import {
  Row, Col, Affix, Space, Switch, Typography, Icon,
  Button,
} from 'sen-kit';
import DotPagination from 'components/dotPagination';
import { SortableProvider, SortableWrapper } from 'components/dnd';

import { DynamicApp } from 'helpers/loader';
import { updateApps } from 'store/babysitter.reducer';


class Home extends Component {
  constructor() {
    super();

    this.state = {
      appNames: [],
      editable: false,
    }
  }

  componentDidMount() {
    this.getAppNames();
  }

  componentDidUpdate(prevProps, prevState) {
    const { babysitter: { apps: prevApps }, location: { search: prevSearch } } = prevProps;
    const { babysitter: { apps }, location: { search } } = this.props;
    if (!isEqual(prevApps, apps)) this.getAppNames();
    if (!isEqual(prevSearch, search)) this.getAppNames();
    const { appNames: prevAppNames } = prevState;
    const { appNames } = this.state;
    if (!isEqual(prevAppNames, appNames)) this.setAppNames();
  }

  parseParams = () => {
    const { babysitter: { apps }, location: { search } } = this.props;
    const params = new URLSearchParams(search);
    const total = apps.length;
    const page = Math.min(parseInt(params.get('page')) || 0, total - 1);
    const appName = params.get('appName') || '';
    const mode = params.get('mode') === 'full' ? 'full' : 'lite';
    return { total, page, appName, mode }
  }

  getAppNames = () => {
    const { babysitter: { apps } } = this.props;
    const { page } = this.parseParams();
    const appNames = apps[page];
    return this.setState({ appNames });
  }

  setAppNames = async () => {
    const { babysitter: { apps }, updateApps } = this.props;
    const { appNames } = this.state;
    const { page } = this.parseParams();
    let newApps = [...apps];
    newApps[page] = appNames;
    return await updateApps(newApps);
  }

  to = async (route = '#') => {
    const { history } = this.props;
    return history.push(route);
  }

  onSort = (newAppNames) => {
    return this.setState({ appNames: newAppNames });
  }

  onEdit = (editable) => {
    return this.setState({ editable });
  }

  render() {
    const { appNames, editable } = this.state;
    const { total, page } = this.parseParams();

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify="center">
          <Col>
            <Affix>
              <DotPagination
                total={total}
                page={page}
                onClick={() => this.to(`/home?page=${page}`)}
              />
            </Affix>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <SortableProvider onChange={this.onSort}>
          {appNames.map(appName => <SortableWrapper
            id={appName}
            key={appName}
            disabled={!editable}
          >
            <DynamicApp appName={appName} />
          </SortableWrapper>)}
        </SortableProvider>
      </Col>
      <Col span={24}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="text"
                className="btnContained"
                icon={<Icon name="add-outline" />}
                onClick={() => this.to('/market')}
                size="small"
              />
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>Add more apps</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>Drag to re-organize widgets!</Typography.Text>
              <Switch
                size="small"
                checkedChildren={<Icon name="cog-outline" />}
                unCheckedChildren={<Icon name="cog-outline" />}
                checked={editable}
                onChange={this.onEdit}
              />
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
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
)(Home));