import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Button, Icon, Space, Tooltip } from 'sen-kit';
import { withSenOs } from 'helpers/senos';

import Pokemon from './pokemon';
import { choosePokemon } from '@/pokemon_deck/controller/main.controller';


class Deck extends Component {
  constructor() {
    super();

    this.state = {
      pokemons: []
    }
  }

  componentDidMount() {
    this.buildPersistentStorage();
  }

  componentDidUpdate(prevProps) {
    const { senos: { wallet: { address: prevAddress } } } = prevProps;
    const { senos: { wallet: { address } } } = this.props;
    if (prevAddress !== address) this.buildPersistentStorage();
  }

  buildPersistentStorage = () => {
    const { senos: { db, wallet: { address } } } = this.props;
    this.collection = db.createInstance({ storeName: address });
    return this.updatePokemon();
  }

  updatePokemon = async () => {
    const pokemons = await this.collection.keys();
    return this.setState({ pokemons });
  }

  catchPokemon = async () => {
    const { main: { name } } = this.props;
    await this.collection.setItem(name, new Date());
    return await this.updatePokemon();
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
      className="contained"
      onClick={() => this.releasePokemon(name)}
      icon={<Icon name="paw-outline" />}
      block
    >Release</Button>
    // Catch
    return <Button
      type="text"
      className="contained"
      onClick={this.catchPokemon}
      icon={<Icon name="magnet-outline" />}
      block
    >Catch</Button>
  }

  render() {
    const { main: { name }, choosePokemon } = this.props;
    const { pokemons } = this.state;

    return <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Pokemon name={name} />
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
            <Pokemon onClick={() => this.releasePokemon(pokemon)} name={pokemon} />
          </Tooltip>)}
        </Space>}
      </Col>
    </Row>
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
)(withSenOs(Deck)));