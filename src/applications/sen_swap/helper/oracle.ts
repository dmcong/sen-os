import { utils, PoolData, Swap } from '@senswap/sen-js'
import { HopData } from '@/sen_swap/view/review/hop'

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

export const curve = (bidAmount: string, data: HopData): string => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: {
      symbol: dstSymbol,
      address: dstMintAddress,
      decimals: askDecimals,
    },
  } = data
  const isDiscounted = dstSymbol === 'SEN'
  const fee = isDiscounted ? FEE : FEE + EARN
  const bidReserve = parseReverse(srcMintAddress, data.poolData)
  const askReserve = parseReverse(dstMintAddress, data.poolData)
  const askAmount = ORACLE.curve(
    utils.decimalize(bidAmount, bidDecimals),
    bidReserve,
    askReserve,
    fee,
    DECIMALS,
  )
  return utils.undecimalize(askAmount, askDecimals)
}

export const inverseCurve = (askAmount: string, data: HopData): string => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: {
      symbol: dstSymbol,
      address: dstMintAddress,
      decimals: askDecimals,
    },
  } = data
  const isDiscounted = dstSymbol === 'SEN'
  const fee = isDiscounted ? FEE : FEE + EARN
  const bidReserve = parseReverse(srcMintAddress, data.poolData)
  const askReserve = parseReverse(dstMintAddress, data.poolData)
  const bidAmount = ORACLE.inverseCurve(
    utils.decimalize(askAmount, askDecimals),
    bidReserve,
    askReserve,
    fee,
    DECIMALS,
  )
  return utils.undecimalize(bidAmount, bidDecimals)
}

export const slippage = (bidAmount: string, data: HopData): string => {
  const {
    srcMintInfo: { address: srcMintAddress, decimals: bidDecimals },
    dstMintInfo: { symbol: dstSymbol, address: dstMintAddress },
  } = data
  const isDiscounted = dstSymbol === 'SEN'
  const fee = isDiscounted ? FEE : FEE + EARN
  const bidReserve = parseReverse(srcMintAddress, data.poolData)
  const askReserve = parseReverse(dstMintAddress, data.poolData)
  const slippage = ORACLE.slippage(
    utils.decimalize(bidAmount, bidDecimals),
    bidReserve,
    askReserve,
    fee,
    DECIMALS,
  )
  return utils.undecimalize(slippage, 9)
}
