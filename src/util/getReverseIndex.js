/**
 * ひっくり返された石の座標取得
 *
 * @param nowStone 置いた石
 * @param boardInfo 現在の盤面
 * @param changedSquares 変更後の盤面
 */
const getReverseIndex = (nowStone, boardInfo, changedSquares) => {
  const reverseIndex = []
  // 現在の盤面を取り出す
  for (const [index, boardValue] of boardInfo.entries()) {
    for (const [stoneIndex, stone] of boardValue.entries()) {
      // 石が置かれていない所はスルー(変更前の盤面には今置いた石はないのでアニメーションされない)
      if (changedSquares[index][stoneIndex] && stone) {
        if (changedSquares[index][stoneIndex] !== stone && stone !== nowStone) {
          reverseIndex.push(index * 8 + stoneIndex)
        }
      }
    }
  }
  return reverseIndex
}
export default getReverseIndex
