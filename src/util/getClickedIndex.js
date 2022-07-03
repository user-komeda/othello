/**
 * クリックした個所の座標を調べる
 *
 * @param event クリックイベント
 * @param button button
 */
const getClickedIndex = (event, button) => {
  const buttonArray = Array.from(button)
  const index = buttonArray.indexOf(event.currentTarget)
  return index
}
export default getClickedIndex
