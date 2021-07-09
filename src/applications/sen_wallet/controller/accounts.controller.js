import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ssjs from 'senswapjs';

import util from 'helpers/util';
import { appName } from '../package.json';

/**
 * Store constructor
 */
const NAME = util.normalizeAppName(appName);
const initialState = {}

/**
 * Actions
 */

export const getAccounts = createAsyncThunk(`${NAME}/getAccounts`, async (ownerAddress) => {
  if (!ssjs.isAddress(ownerAddress)) throw new Error('Invalid owner/wallet address');
  const splt = window.senos.splt;
  const ownerPublicKey = ssjs.fromAddress(ownerAddress);
  const { value } = await splt.connection.getTokenAccountsByOwner(ownerPublicKey, { programId: splt.spltProgramId });
  let bulk = {}
  value.forEach(({ pubkey, account: { data: buf } }) => {
    const address = pubkey.toBase58();
    const data = splt.parseAccountData(buf);
    return bulk[address] = data;
  });
  return bulk;
});

export const upsetAccount = createAsyncThunk(`${NAME}/upsetAccount`, async ({ address, data }) => {
  if (!ssjs.isAddress(address)) throw new Error('Invalid address');
  if (!data) throw new Error('Data is empty');
  return { [address]: data }
});

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  extraReducers: builder => void builder
    .addCase(getAccounts.fulfilled, (state, { payload }) => void Object.assign(state, payload))
    .addCase(upsetAccount.fulfilled, (state, { payload }) => void Object.assign(state, payload))
});

export default slice.reducer;