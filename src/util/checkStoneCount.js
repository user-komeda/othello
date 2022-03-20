import { BLACK_STONE, WHITE_STONE } from '../const'

/**
 * 現在の盤面の医師の数をカウント
 *
 * @param squares 現在の盤面
 */
const checkStoneCount = (squares) => {
  /** 黒石 */
  let blackStoneCount = 0
  /** 白石 */
  let whiteStoneCount = 0

  /** 2次元配列を1次元に */
  const flatSquares = squares.reduce((pre, current) => {
    pre.push(...current)
    return pre
  }, [])

  /** 石の数をそれぞれカウント */
  for (const flatSquare of flatSquares) {
    if (flatSquare === BLACK_STONE) {
      blackStoneCount++
    } else if (flatSquare === WHITE_STONE) {
      whiteStoneCount++
    }
  }
  return [blackStoneCount, whiteStoneCount]
}
export default checkStoneCount
