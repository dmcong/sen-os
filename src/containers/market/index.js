import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import universe from 'universe.json';

import { Row, Col } from 'sen-kit';
import Search from './search';
import HeroPanel from './heroPanel';
import CategoryCard from './categoryCard';
import Community from './community';
import Foundation from './foundation';


class Market extends Component {
  constructor() {
    super();

    this.state = {
      appNames: Object.keys(universe).map(id => universe[id].appName),
      categories: ['SenSwap', 'Fun', 'Pokemon', 'Tu Phan']
    }
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  search = (keyword) => {
    if (!keyword) return;
    const { history } = this.props;
    const subRoute = encodeURI(keyword.toLowerCase());
    return history.push(`/market?search=${subRoute}`);
  }

  render() {
    const { categories } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} /> {/* Spacing */}
      <Col span={24}>
        <HeroPanel />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          {categories.map((category, i) => <Col
            key={i}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            xl={{ span: 6 }}
          >
            <CategoryCard 
            category={category}
             onClick={() => this.search(category)} 
             />
          </Col>)}
        </Row>
      </Col>
      <Col span={24} style={{ height: 32 }} /> {/* Spacing */}
      <Col span={24}>
        <Community />
      </Col>
      <Col span={24} style={{ height: 32 }} /> {/* Spacing */}
      <Col span={24}>
        <Foundation />
      </Col>
    </Row >
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Market));