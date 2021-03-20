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
          for (const array of tmpHougaku) {
            hougaku.push(array)
          }
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
        colIndex + j > 7 ||
        rowIndex === colIndex
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
  let count = 0
  while (
    rowIndex + i >= 0 &&
    rowIndex + i <= 7 &&
    colIndex + j >= 0 &&
    colIndex + j <= 7
  ) {
    array.push(square[rowIndex + i][colIndex + j])
    i += i
    j += j
    count++
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
  const firstIndex = array.indexOf(stone)
  let flag = true
  if (firstIndex !== -1) {
    for (let i = 0; i < array.length; i++) {
      if (i === 0 || i === firstIndex) {
        continue
      }
      if (array[i] === stone) {
        flag = false
        break
      }
    }
    if (flag === true) {
      return true
    } else {
      return false
    }
  } else {
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
