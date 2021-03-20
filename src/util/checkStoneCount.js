const checkStoneCount = () => {
  const squares = document.querySelectorAll('.square')
  let blackStoneCount = 0
  let whiteStoneCount = 0
  for (const square of squares) {
    if (square.textContent === '●') {
      blackStoneCount++
    } else if (square.textContent === '○') {
      whiteStoneCount++
    } else {
      continue
    }
  }
  return [blackStoneCount, whiteStoneCount]
}
export default checkStoneCount
