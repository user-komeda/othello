/**
 *click可能なマスにIDを付与
 *
 * @param {*} rowIndex マス目行
 * @param {*} colIndex マス目列
 * @param {*} canPutStoneIndexes 石を置くことができるマス目
 * @param {*} squaresDom dom状態
 */
const addCanClickId = (rowIndex, colIndex, canPutStoneIndexes, squaresDom) => {
  for (const [index, item] of rowIndex.entries()) {
    const rowNum = item * 8
    const colNum = colIndex[index]
    canPutStoneIndexes.push(rowNum + colNum)
  }
  if (squaresDom) {
    for (const item of canPutStoneIndexes) {
      for (const [index, squareDom] of squaresDom.entries()) {
        if (index === item) {
          squareDom.id = 'canClick'
        }
      }
    }
  }
}
export default addCanClickId
