/**
 *
 * @param {*} rowIndex
 * @param {*} colIndex
 * @param {*} arrayIndex
 * @param {*} squaresDom
 */
const addCanClickId = (rowIndex, colIndex, arrayIndex, squaresDom) => {
  for (const [index, item] of rowIndex.entries()) {
    const rowNum = item * 8
    const colNum = colIndex[index]
    arrayIndex.push(rowNum + colNum)
  }
  if (squaresDom) {
    for (const item of arrayIndex) {
      for (const [index, squareDom] of squaresDom.entries()) {
        if (index === item) {
          squareDom.id = 'canClick'
        }
      }
    }
  }
}
export default addCanClickId
