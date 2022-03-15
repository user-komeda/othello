/**
 * @param blackStoneCount 黒石の数
 * @param whiteStoneCount 白石の数
 */
const checkWinner = (blackStoneCount, whiteStoneCount) => {
  if (blackStoneCount > whiteStoneCount) {
    return 'black'
  } else if (blackStoneCount < whiteStoneCount) {
    return 'white'
  } else {
    return '引き分け'
  }
}
export default checkWinner
