import { PoolData } from '@senswap/sen-js'
import { ExtendedPoolData } from '../view'

/**
 * Extract reserve from pool data
 * @param extractReserve
 * @param poolData
 * @returns
 */
export const extractReserve = (
  mintAddress: string,
  poolData: PoolData,
): bigint => {
  const { mint_s, mint_a, mint_b, reserve_s, reserve_a, reserve_b } = poolData
  if (mintAddress === mint_s) return reserve_s
  if (mintAddress === mint_a) return reserve_a
  if (mintAddress === mint_b) return reserve_b
  throw new Error('Cannot find reserves')
}

/**
 *
 * @param param0
 * @param param1
 * @returns
 */
type Point = { point: bigint }
export const pointSorting = (
  { point: firstPoint }: Point,
  { point: secondPoint }: Point,
) => {
  if (firstPoint < secondPoint) return 1
  if (firstPoint > secondPoint) return -1
  return 0
}

/**
 * Search a direct pool
 * @param bidPools
 * @param askPools
 * @returns
 */
export const findDirectPool = (
  bidMintAddress: string,
  bidPools: ExtendedPoolData[],
  askMintAddress: string,
  askPools: ExtendedPoolData[],
): string | undefined => {
  const pools: ExtendedPoolData[] = []
  bidPools.forEach(({ address: bidPoolAddress }) => {
    askPools.forEach((askPool) => {
      const { address: askPoolAddress } = askPool
      if (bidPoolAddress === askPoolAddress) pools.push(askPool)
    })
  })
  if (!pools.length) return undefined
  return pools
    .map(({ address, ...poolData }) => {
      const point =
        extractReserve(bidMintAddress, poolData) *
        extractReserve(askMintAddress, poolData)
      return { address, point }
    })
    .sort(pointSorting)[0].address
}

/**
 * Search an optimal route
 * @param bidMintAddress
 * @param bidPools
 * @param askMintAddress
 * @param askPools
 * @returns
 */
export const findOptimalRoute = (
  bidMintAddress: string,
  bidPools: ExtendedPoolData[],
  askMintAddress: string,
  askPools: ExtendedPoolData[],
): string[] => {
  const indexBidPool = findMaxPoolIndex(bidMintAddress, bidPools)
  const { address: bidPoolAddress } = bidPools[indexBidPool]
  const indexAskPool = findMaxPoolIndex(askMintAddress, askPools)
  const { address: askPoolAddress } = askPools[indexAskPool]
  return [bidPoolAddress, askPoolAddress]
}

/**
 * Find max pool in terms of multiplying reserve_x and reserve_s
 * @param mintAddress
 * @param pools
 * @returns
 */
export const findMaxPoolIndex = (
  mintAddress: string,
  pools: PoolData[],
): number => {
  return pools
    .map(({ mint_a, mint_b, reserve_a, reserve_b, reserve_s }, index) => {
      let point = BigInt(0)
      if (mint_a === mintAddress) point = reserve_a * reserve_s
      if (mint_b === mintAddress) point = reserve_b * reserve_s
      return { index, point }
    })
    .sort(pointSorting)[0].index
}
