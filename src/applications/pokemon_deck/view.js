import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Widget, Typography, Button, Icon, Space, Tooltip } from 'sen-kit';

import Keyword from 'containers/market/search/keyword';
import { choosePokemon } from './controller';


class View extends Component {
  constructor() {
    super();

    this.state = {
      pokemons: []
    }
  }

  componentDidMount() {
    const { db, wallet: { address } } = this.props;
    this.collection = db.createInstance({ storeName: address });
    this.updatePokemon();
  }

  updatePokemon = async () => {
    const pokemons = await this.collection.keys();
    return this.setState({ pokemons });
  }

  catchPokemon = async () => {
    const { main: { name }, choosePokemon } = this.props;
    await this.collection.setItem(name, new Date());
    await this.updatePokemon();
    return await choosePokemon();
  }

  releasePokemon = async (pokemon) => {
    await this.collection.removeItem(pokemon);
    return await this.updatePokemon();
  }

  action = () => {
    const { main: { name } } = this.props;
    const { pokemons } = this.state;
    // Release
    if (pokemons.includes(name)) return <Button
      type="text"
      className="btnContained"
      onClick={() => this.releasePokemon(name)}
      icon={<Icon name="paw-outline" />}
      block
    >Release</Button>
    // Catch
    return <Button
      type="text"
      className="btnContained"
      onClick={this.catchPokemon}
      icon={<Icon name="magnet-outline" />}
      block
    >Catch</Button>
  }

  render() {
    const { main: { name }, choosePokemon } = this.props;
    const { pokemons } = this.state;

    return <Widget size="medium" type="glass">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1} align="center">Pokemon Deck</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Title level={4} align="center">{name}</Typography.Title>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            onClick={choosePokemon}
            icon={<Icon name="footsteps-outline" />}
            block
          >Explore</Button>
        </Col>
        <Col span={12}>
          {this.action()}
        </Col>
        <Col span={24}>
          {<Space wrap>
            {pokemons.map(pokemon => <Tooltip key={pokemon} title="Click to release">
              <Keyword onClick={() => this.releasePokemon(pokemon)} title={pokemon} />
            </Tooltip>)}
          </Space>}
        </Col>
      </Row>
    </Widget>
  }
}

const mapStateToProps = state => ({
  main: state.main,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  choosePokemon
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(View));