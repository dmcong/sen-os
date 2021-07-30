import { PoolData, Swap } from '@senswap/sen-js'
import { HopData } from './hop'

export const ORACLE = Swap.oracle
export const FEE = BigInt(2500000)
export const EARN = BigInt(500000)
export const DECIMALS = BigInt(1000000000)

export const parseReverse = (
  mintAddress: string,
  poolData: PoolData,
): bigint => {
  if (mintAddress === poolData.mint_a) return poolData.reserve_a
  if (mintAddress === poolData.mint_b) return poolData.reserve_b
  if (mintAddress === poolData.mint_s) return poolData.reserve_s
  return BigInt(0)
}

export const curve = (data: HopData): bigint => {
  const {
    srcMintInfo: { address: srcMintAddress },
    dstMintInfo: { symbol: dstSymbol, address: dstMintAddress },
  } = data
  const isDiscounted = dstSymbol === 'SEN'
  const fee = isDiscounted ? FEE : FEE + EARN
  const bidReserve = parseReverse(srcMintAddress, data.poolData)
  const askReserve = parseReverse(dstMintAddress, data.poolData)
  const askAmount = ORACLE.curve(
    data.amount,
    bidReserve,
    askReserve,
    fee,
    DECIMALS,
  )
  return askAmount
}

export const slippage = (data: HopData): bigint => {
  const {
    srcMintInfo: { address: srcMintAddress },
    dstMintInfo: { symbol: dstSymbol, address: dstMintAddress },
  } = data

  const isDiscounted = dstSymbol === 'SEN'
  const fee = isDiscounted ? FEE : FEE + EARN
  const bidReserve = parseReverse(srcMintAddress, data.poolData)
  const askReserve = parseReverse(dstMintAddress, data.poolData)
  const slippage = ORACLE.slippage(
    data.amount,
    bidReserve,
    askReserve,
    fee,
    DECIMALS,
  )
  return slippage
}
