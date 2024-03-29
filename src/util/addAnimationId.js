const addAnimationId = (nowStone, squares, changedSquares) => {
  const reverseIndex = []
  for (const [index, square] of squares.entries()) {
    for (const [stoneIndex, stone] of square.entries()) {
      if (changedSquares[index][stoneIndex] && stone) {
        if (changedSquares[index][stoneIndex] !== stone && stone !== nowStone) {
          reverseIndex.push(index * 8 + stoneIndex)
        }
      }
    }
  }
  return reverseIndex
}
export default addAnimationId
