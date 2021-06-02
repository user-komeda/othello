const checkStoneCount = squares => {
  let blackStoneCount = 0
  let whiteStoneCount = 0

  const flatSquares = squares.reduce((pre, current) => {
    pre.push(...current)
    return pre
  }, [])
  for (let flatSquare of flatSquares) {
    if (flatSquare === '●') {
      blackStoneCount++
    } else if (flatSquare === '○') {
      whiteStoneCount++
    }
  }
  return [blackStoneCount, whiteStoneCount]
}
export default checkStoneCount
