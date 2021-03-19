/**
 *
 * @param {*} index
 * @param {NodeListOf<Element>} squares
 * @returns
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
