const checkWinner = (blackStoneCount, whiteStoneCount) => {
  console.log('winner')
  if (blackStoneCount > whiteStoneCount) {
    return 'black'
  } else if (blackStoneCount < whiteStoneCount) {
    return 'white'
  } else {
    return '引き分け'
  }
}
export default checkWinner
