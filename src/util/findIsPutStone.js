import { OTHELLO_COL_SIZE, OTHELLO_ROW_SIZE } from '../const'
const BOTTOM_LEFT = 0
const BOTTOM_MIDDLE = 1
const BOTTOM_RIGHT = 2
const LEFT = 3
const MIDDLE = 4
const RIGHT = 5
const TOP_LEFT = 6
const TOP_MIDDLE = 7
const TOP_RIGHT = 8

/**
 * 石を置くことができる座標をすべて取得
 *
 * @param {Array<string[]>} boardInfo 現在の盤面の石の状態
 * @param {string} stone おこうとしている石
 */
const findCanPutStoneIndex = (boardInfo, stone) => {
  const rowIndexes = []
  const colIndexes = []
  const hougaku = []
  for (let i = 0; i < OTHELLO_ROW_SIZE; i++) {
    for (let j = 0; j < OTHELLO_COL_SIZE; j++) {
      if (boardInfo[i][j] === '') {
        const tmpHougaku = checkNext(i, j, stone, boardInfo)
        if (tmpHougaku !== null && tmpHougaku.length !== 0) {
          hougaku.push(tmpHougaku)
          rowIndexes.push(i)
          colIndexes.push(j)
        }
      } else {
        continue
      }
    }
  }
  return [rowIndexes, colIndexes, hougaku]
}

/**
 * すべてのマスに対してその隣のマスに違う石が置いているか調べる
 *
 * @param {*} rowIndex 盤面の行座標
 * @param {*} colIndex 盤面の列座標
 * @param {*} stone おこうとしている石
 * @param {*} boardInfo 現在の盤面の石の状態
 */
const checkNext = (rowIndex, colIndex, stone, boardInfo) => {
  const hougaku = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        // オセロのマスからはみ出ている場合スキップ
        rowIndex + i < 0 ||
        rowIndex + i > 7 ||
        colIndex + j < 0 ||
        colIndex + j > 7
      ) {
        continue
      }
      if (
        // 石が置かれてないもしくは同じ色の石があればスキップ
        boardInfo[rowIndex + i][colIndex + j] === '' ||
        boardInfo[rowIndex + i][colIndex + j] === stone
      ) {
        continue
      }
      if (i === 0 && j === 0) {
        continue
      }
      if (getCheckedStone(stone, i, j, boardInfo, rowIndex, colIndex)) {
        const index = checkHougaku(i, j)
        hougaku.push(index)
      }
    }
  }
  return hougaku
}

/**
 * checkNext関数で調べた方向に対してすべて石を取得する
 *
 * @param {string} stone おこうとしている石
 * @param {number} i 行方向への増加量
 * @param {number} j 列方向への増加量
 * @param {Array<string[]>} boardInfo 現在の盤面の石の状態
 * @param {number} rowIndex 盤面の行座標
 * @param {number} colIndex 盤面の列座標
 */

const getCheckedStone = (stone, i, j, boardInfo, rowIndex, colIndex) => {
  const stones = []
  let ix = i
  let jx = j

  while (
    rowIndex + ix >= 0 &&
    rowIndex + ix <= 7 &&
    colIndex + jx >= 0 &&
    colIndex + jx <= 7
  ) {
    stones.push(boardInfo[rowIndex + ix][colIndex + jx])
    ix += i
    jx += j
  }
  return checkArrayStone(stones, stone)
}

/**
 *石が置けるか確認
 *
 * @param {Array<string[]>} stones 取得したすべての石
 * @param {string} stone おこうとしている石
 */
const checkArrayStone = (stones, stone) => {
  const filteredArray = stones
  const firstIndex = filteredArray.indexOf(stone)
  if (firstIndex === 1) {
    return true
  }
  if (firstIndex !== -1) {
    filteredArray.length = firstIndex
    for (let i = 0; i < filteredArray.length; i++) {
      if (filteredArray[i] === '') {
        return false
      }
    }
    return true
  } else {
    return false
  }
}

/**
 * 石が置ける方角を調べる
 *
 * @param {number} i 行方向への増加量
 * @param {number} j 列方向への増加量
 */
const checkHougaku = (i, j) => {
  switch (i) {
    case -1:
      switch (j) {
        case -1:
          return BOTTOM_LEFT
        case 0:
          return BOTTOM_MIDDLE
        case 1:
          return BOTTOM_RIGHT
        default:
          break
      }
      break

    case 0:
      switch (j) {
        case -1:
          return LEFT
        case 0:
          return MIDDLE
        case 1:
          return RIGHT
        default:
          break
      }
      break

    case 1:
      switch (j) {
        case -1:
          return TOP_LEFT
        case 0:
          return TOP_MIDDLE
        case 1:
          return TOP_RIGHT
        default:
          break
      }
      break

    default:
      break
  }
}
export default findCanPutStoneIndex
