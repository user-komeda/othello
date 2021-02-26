const getClickedIndex = (event, button) => {
  const buttonArray = Array.from(button)
  const index = buttonArray.indexOf(event.currentTarget)
  return index
}
export default getClickedIndex
