import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';
import numeral from 'numeral';

import { Row, Col, Typography, Tooltip } from 'sen-kit';

import util from 'helpers/util';
import { withSenOs } from 'helpers/context';
import { updateTime } from '../controller/main.controller';


class View extends Component {
  render() {
    const { senos: { wallet: { address, lamports } } } = this.props;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={1}>SenWallet</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Link href={util.explorer(address)} target="_blank" ellipsis>{address.substring(0, 20) + '...'}</Typography.Link>
      </Col>
      <Col span={24}>
        <Tooltip title={`${ssjs.undecimalize(lamports, 9)} SOL`}>
          <Typography.Text>{numeral(ssjs.undecimalize(lamports, 9)).format('0.[0000]')} SOL</Typography.Text>
        </Tooltip>
      </Col>
    </Row>
  }
}

const mapStateToProps = state => ({
  main: state.main,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTime
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withSenOs(View)));