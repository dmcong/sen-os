import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button, Icon, Space, Tooltip } from 'sen-kit'
import { useSenOs } from 'helpers/senos'

import Pokemon from './pokemon'
import { choosePokemon } from '@/pokemon_deck/controller/main.controller'

const Deck = () => {
  const [pokemons, setPokemons] = useState([])
  const dispatch = useDispatch()
  const {
    senos: { db },
  } = useSenOs()
  const { name } = useSelector((state) => state.main)

  const updatePokemon = useCallback(async () => {
    const pokemonList = await db.keys()
    await setPokemons(pokemonList)
  }, [db])
  const catchPokemon = async () => {
    await db.setItem(name, new Date())
    await updatePokemon()
  }
  const releasePokemon = async (pokemon) => {
    await db.removeItem(pokemon)
    await updatePokemon()
  }

  useEffect(() => {
    updatePokemon()
  }, [updatePokemon])

  const action = () => {
    // Release
    if (pokemons.includes(name))
      return (
        <Button
          type="text"
          className="contained"
          onClick={() => this.releasePokemon(name)}
          icon={<Icon name="paw-outline" />}
          block
        >
          Release
        </Button>
      )
    // Catch
    return (
      <Button
        type="text"
        className="contained"
        onClick={catchPokemon}
        icon={<Icon name="magnet-outline" />}
        block
      >
        Catch
      </Button>
    )
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Pokemon name={name} />
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          onClick={() => dispatch(choosePokemon())}
          icon={<Icon name="footsteps-outline" />}
          block
        >
          Explore
        </Button>
      </Col>
      <Col span={12}>{action()}</Col>
      <Col span={24}>
        {
          <Space wrap>
            {pokemons.map((pokemon) => (
              <Tooltip key={pokemon} title="Click to release">
                <Pokemon
                  onClick={() => releasePokemon(pokemon)}
                  name={pokemon}
                />
              </Tooltip>
            ))}
          </Space>
        }
      </Col>
    </Row>
  )
}

export default Deck
