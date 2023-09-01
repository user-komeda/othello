/**
 * 石をひっくり返す関数
 *
 * @param clickedRowIndex クリックした行座標
 * @param clickedColIndex クリックした列座標
 * @param hougaku ひっくり返す方角
 * @param rowIndex 行index
 * @param colIndex 列index
 * @param boardInfo オセロの盤面
 * @param stone オセロの石
 */
const reverseStone = (
  clickedRowIndex,
  clickedColIndex,
  hougaku,
  rowIndex,
  colIndex,
  boardInfo,
  stone
) => {
  const notReversedBoardInfo = JSON.parse(JSON.stringify(boardInfo))
  notReversedBoardInfo[clickedRowIndex][clickedColIndex] = stone
  const rowIndexMatch = []
  rowIndex.map((val, index) => {
    if (val === clickedRowIndex) {
      rowIndexMatch.push(index)
    }
  })
  const colIndexMatch = []
  colIndex.map((val, index) => {
    if (val === clickedColIndex) {
      colIndexMatch.push(index)
    }
  })

  let test = null
  label: for (const rowVal of rowIndexMatch) {
    for (const colVal of colIndexMatch) {
      if (rowVal === colVal) {
        test = rowVal
        break label
      }
    }
  }
  const checkedHougaku = hougaku[test]
  for (const val of checkedHougaku) {
    let rowChange = 0
    let colChange = 0
    const [rowIndexChange, colIndexChange] = convertHougaku(val)
    const array = checkReverse(
      rowIndexChange,
      colIndexChange,
      clickedRowIndex,
      clickedColIndex,
      boardInfo,
      stone
    )
    // eslint-disable-next-line no-unused-vars
    for (const _ of array) {
      boardInfo[clickedRowIndex + rowChange][clickedColIndex + colChange] =
        stone
      rowChange += rowIndexChange
      colChange += colIndexChange
    }
  }

  return [boardInfo, notReversedBoardInfo]
}

const convertHougaku = (hougaku) => {
  let rowChangeNum = null
  let colChangeNum = null
  switch (hougaku) {
    case 0:
      rowChangeNum = -1
      colChangeNum = -1
      break
    case 1:
      rowChangeNum = -1
      colChangeNum = 0
      break
    case 2:
      rowChangeNum = -1
      colChangeNum = 1
      break
    case 3:
      rowChangeNum = 0
      colChangeNum = -1
      break
    case 4:
      break
    case 5:
      rowChangeNum = 0
      colChangeNum = 1
      break
    case 6:
      rowChangeNum = 1
      colChangeNum = -1
      break
    case 7:
      rowChangeNum = 1
      colChangeNum = 0
      break
    case 8:
      rowChangeNum = 1
      colChangeNum = 1
      break

    default:
      break
  }
  return [rowChangeNum, colChangeNum]
}

const checkReverse = (
  rowIndexChange,
  colIndexChange,
  clickedRowIndex,
  clickedColIndex,
  boardInfo,
  stone
) => {
  const array = []
  let rowChange = 0
  let colChange = 0
  while (
    clickedRowIndex + rowChange >= 0 &&
    clickedRowIndex + rowChange <= 7 &&
    clickedColIndex + colChange >= 0 &&
    clickedColIndex + colChange <= 7
  ) {
    array.push(
      boardInfo[clickedRowIndex + rowChange][clickedColIndex + colChange]
    )
    rowChange += rowIndexChange
    colChange += colIndexChange
  }
  const index = array.indexOf(stone)
  if (index > 0) {
    array.length = index + 1
    array.unshift(stone)
  }
  // 複数方向にひっくり返せる場合先頭にstoneが来ることはあり得る
  if (index === 0) {
    const nextIndex = array.indexOf(stone, 1)
    array.length = nextIndex + 1
  }

  return array.filter((val) => {
    return val !== ''
  })
}

export default reverseStone
