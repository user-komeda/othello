import Square from '../square/Square'

const reverseStone = (
  clickedRowIndex,
  clickedColIndex,
  hougaku,
  rowIndex,
  colIndex,
  square,
  stone
) => {
  const notReverseStone = JSON.parse(JSON.stringify(square))
  notReverseStone[clickedRowIndex][clickedColIndex] = stone
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
  label: for (const [index, rowVal] of rowIndexMatch.entries()) {
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
    let [rowIndexChange, colIndexChange] = convertHougaku(val)
    const array = checkReverse(
      rowIndexChange,
      colIndexChange,
      clickedRowIndex,
      clickedColIndex,
      square,
      stone
    )
    for (const _ of array) {
      square[clickedRowIndex + rowChange][clickedColIndex + colChange] = stone
      rowChange += rowIndexChange
      colChange += colIndexChange
    }
  }
  return [square, notReverseStone]
}

const convertHougaku = hougaku => {
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
  square,
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
    array.push(square[clickedRowIndex + rowChange][clickedColIndex + colChange])
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

  return array.filter(val => {
    return val !== ''
  })
}

export default reverseStone
