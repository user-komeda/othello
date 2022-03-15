/**
 * @param squares 現在の盤面
 */
const checkStoneCount = (squares) => {
  let blackStoneCount = 0
  let whiteStoneCount = 0

  const flatSquares = squares.reduce((pre, current) => {
    pre.push(...current)
    return pre
  }, [])
  for (const flatSquare of flatSquares) {
    if (flatSquare === '●') {
      blackStoneCount++
    } else if (flatSquare === '○') {
      whiteStoneCount++
    }
  }
  return [blackStoneCount, whiteStoneCount]
}
export default checkStoneCount
