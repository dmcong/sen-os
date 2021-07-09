import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Document } from 'flexsearch';

import { Row, Col, Card, Input, Icon } from 'sen-kit';

import mintConfig from '@/sen_wallet/config/mint.config';

const KEYSIZE = 3;
const PRESET = {
  tokenize: 'full',
  context: true,
  minlength: KEYSIZE
}
const RULE = {
  document: {
    id: 'address',
    index: [
      { field: 'ticket', ...PRESET },
      { field: 'symbol', ...PRESET },
      { field: 'name', ...PRESET },
      { field: 'mint', ...PRESET },
    ]
  }
}

const Search = ({ onChange }) => {
  const [keyword, setKeyword] = useState('');
  const accounts = useSelector(state => state.accounts);
  const engine = useMemo(() => {
    const index = new Document(RULE);
    mintConfig.forEach(mint => index.add(mint));
    Object.keys(accounts).forEach(address => index.add({ address, ...accounts[address] }));
    return index;
  }, [accounts]);

  useEffect(() => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(null);
    let accountAddresses = [];
    engine.search(keyword).forEach(({ field, result }) => {
      if (field === 'mint') return result.forEach(address => {
        if (accountAddresses.includes(address)) return;
        return accountAddresses.push(address);
      });
      return result.forEach(address => {
        return Object.keys(accounts).forEach(key => {
          const { mint } = accounts[key];
          if (mint !== address || accountAddresses.includes(key)) return;
          return accountAddresses.push(key);
        });
      });
    });
    return onChange(accountAddresses);
  }, [keyword, engine, accounts, onChange]);

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Card bodyStyle={{ padding: 8 }} bordered={false}>
        <Input
          placeholder="Search"
          value={keyword}
          size="small"
          bordered={false}
          suffix={keyword ? <Icon name="close-outline" onClick={() => setKeyword('')} /> : <Icon name="search-outline" />}
          onChange={e => setKeyword(e.target.value)}
        />
      </Card>
    </Col>
  </Row>
}

Search.defaultProps = {
  onChange: () => { }
}

Search.propTypes = {
  onChange: PropTypes.func,
}

export default Search;