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
  const index = rowIndex.indexOf(clickedRowIndex)
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
      // console.log(rowVal, colVal)
      if (rowVal === colVal) {
        test = rowVal
        break label
      }
    }
  }
  // console.log(test)
  const checkedHougaku = hougaku[test]
  let rowChange = 0
  let colChange = 0
  for (const val of checkedHougaku) {
    console.log(val)
    let [rowIndexChange, colIndexChange] = convertHougaku(val)
    const array = checkReverse(
      rowIndexChange,
      colIndexChange,
      clickedRowIndex,
      clickedColIndex,
      square,
      stone
    )
    // console.log(array)
    for (const _ of array) {
      square[clickedRowIndex + rowChange][clickedColIndex + colChange] = stone
      rowChange += rowIndexChange
      colChange += colIndexChange
    }
  }
  return square
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
    // console.log(rowChange, colChange)
    rowChange += rowIndexChange
    colChange += colIndexChange
  }
  const index = array.indexOf(stone)
  // console.log(index)
  array.length = index + 1
  array.unshift(stone)

  return array.filter(val => {
    return val !== ''
  })
}

export default reverseStone
