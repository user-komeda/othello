/**
 * すべてのマスに対して石を置くことができるか調べる
 * @param {Array<String[]>} square 現在の盤面の石の状態
 * @param {String} stone おこうとしている石
 */
const check = (square, stone) => {
  const rowIndex = []
  const colIndex = []
  const hougaku = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (square[i][j] === '') {
        const tmpHougaku = checkNext(i, j, stone, square)
        if (tmpHougaku !== null && tmpHougaku.length !== 0) {
          // for (const array of tmpHougaku) {
          //   hougaku.push(array)
          // }
          hougaku.push(tmpHougaku)
          rowIndex.push(i)
          colIndex.push(j)
        }
      } else {
        continue
      }
    }
  }
  return [rowIndex, colIndex, hougaku]
}

/**
 * すべてのマスに対してその隣のマスに違う石が置いているか調べる
 * @param {int} rowIndex 盤面の行座標
 * @param {int} colIndex 盤面の列座標
 * @param {String} stone おこうとしている石
 * @param {Array<String[]>} square 現在の盤面の石の状態
 */
const checkNext = (rowIndex, colIndex, stone, square) => {
  const hougaku = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        rowIndex + i < 0 ||
        rowIndex + i > 7 ||
        colIndex + j < 0 ||
        colIndex + j > 7
        // rowIndex === colIndex
      ) {
        continue
      }
      if (
        square[rowIndex + i][colIndex + j] === '' ||
        square[rowIndex + i][colIndex + j] === stone
      ) {
        continue
      }
      if (i === 0 && j === 0) {
        continue
      }
      if (getCheckedStone(stone, i, j, square, rowIndex, colIndex)) {
        const index = checkHougaku(i, j)
        hougaku.push(index)
        // console.log(hougaku)
      }
    }
  }
  return hougaku
}

/**
 * checkNext関数で調べた方向に対してすべて石を取得する
 * @param {String} stone おこうとしている石
 * @param {int} i 行方向への増加量
 * @param {int} j 列方向への増加量
 * @param {Array<String[]>} square 現在の盤面の石の状態
 * @param {int} rowIndex 盤面の行座標
 * @param {int} colIndex 盤面の列座標
 */

const getCheckedStone = (stone, i, j, square, rowIndex, colIndex) => {
  const array = []
  let ix = i
  let jx = j
  // console.log(i, j)

  while (
    rowIndex + ix >= 0 &&
    rowIndex + ix <= 7 &&
    colIndex + jx >= 0 &&
    colIndex + jx <= 7
  ) {
    // console.log(rowIndex, colIndex)
    // console.log(square)
    // console.log(rowIndex + ix, colIndex + jx)
    array.push(square[rowIndex + ix][colIndex + jx])
    // console.log(array)
    ix += i
    jx += j
  }
  return checkArrayStone(array, stone)
}

//
/**
 *石が置けるか確認
 * @param {Array<String[]>} array
 * @param {String} stone
 */
const checkArrayStone = (array, stone) => {
  // console.log
  const filteredArray = array
  // console.log(filteredArray)
  const firstIndex = filteredArray.indexOf(stone)
  // console.log(firstIndex)
  let flag = true
  if (firstIndex !== -1) {
    empty: for (let i = 0; i < filteredArray.length; i++) {
      // console.log(i)
      if (i === 0 || i === firstIndex) {
        // console.log(i)
        continue
      }
      if (filteredArray[i] !== stone && filteredArray[i] !== '') {
        for (let index = 1; index < i; index++) {
          if (filteredArray[index] === '') {
            console.log('aaa')
            flag = false
            break empty
          }
        }
        flag = true
        // console.log('bbb')
        break
      }
    }
    if (flag === true) {
      // console.log('true')
      return true
    } else {
      // console.log('false')
      return false
    }
  } else {
    // console.log('faire２')
    return false
  }
}

/**
 * 石が置ける方角を調べる
 * @param {int} i 行方向への増加量
 * @param {itn} j 列方向への増加量
 */
const checkHougaku = (i, j) => {
  switch (i) {
    case -1:
      switch (j) {
        case -1:
          return 0
        case 0:
          return 1
        case 1:
          return 2
        default:
          break
      }
      break

    case 0:
      switch (j) {
        case -1:
          return 3
        case 0:
          return 4
        case 1:
          return 5
        default:
          break
      }
      break

    case 1:
      switch (j) {
        case -1:
          return 6
        case 0:
          return 7
        case 1:
          return 8
        default:
          break
      }
      break

    default:
      break
  }
}
export default check
