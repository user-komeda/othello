/**
 * クリックした個所に石を置けるか確認
 *
 * @param {*} index 石を置いた座標
 * @param {*} squares 現在の盤面
 * @returns {*} おけるかどうか
 */
const isCheckPutStonePlace = (index, squares) => {
  const idName = squares[index].id
  if (squares[index].textContent === '' && idName === 'canClick') {
    return true
  } else {
    return false
  }
}
export default isCheckPutStonePlace
