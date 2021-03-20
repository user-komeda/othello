const checkWinner = (blackStoneCount, whiteStoneCount) => {
  if (blackStoneCount > whiteStoneCount) {
    return 'black'
  } else if (blackStoneCount < whiteStoneCount) {
    return 'white'
  } else {
    return null
  }
}
export default checkWinner
