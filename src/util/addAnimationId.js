/**
 * アニメーション対象のdomにidをつける
 *
 * @param nowStone 置いた石
 * @param squares 現在の盤面
 * @param changedSquares 変更後の盤面
 */
const addAnimationId = (nowStone, squares, changedSquares) => {
  const reverseIndex = []
  // 現在の盤面を取り出す
  for (const [index, square] of squares.entries()) {
    for (const [stoneIndex, stone] of square.entries()) {
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
export default addAnimationId
