import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ssjs from 'senswapjs';

import util from 'helpers/util';
import solConfig from '@/sen_wallet/config/sol.config';
import { appName } from '../package.json';

/**
 * Utility
 */

const { spltAddress, splataAddress, node } = solConfig;
window.senos = window.senos || {}
window.senos.splt = new ssjs.SPLT(spltAddress, splataAddress, node);

/**
 * Store constructor
 */

const NAME = util.normalizeAppName(appName);
const initialState = {
  accounts: [],
}

/**
 * Actions
 */

export const getAccounts = createAsyncThunk(`${NAME}/getAccounts`, async (ownerAddress, { fulfillWithValue }) => {
  if (!ssjs.isAddress(ownerAddress)) throw new Error('Invalid owner/wallet address');
  const ownerPublicKey = ssjs.fromAddress(ownerAddress);
  const programId = ssjs.fromAddress(spltAddress);
  const splt = window.senos.splt;
  const { value } = await splt.connection.getTokenAccountsByOwner(ownerPublicKey, { programId });
  const data = value.map(({ pubkey, account: { data } }) => ({
    address: pubkey.toBase58(),
    data: splt.parseAccountData(data)
  }));
  const accounts = data.map(({ address }) => address);
  return fulfillWithValue({ accounts }, { data });
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(getAccounts.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;