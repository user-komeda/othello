import React from 'react'
import Square from '../square/Square'
const Board = (props) => {
  const renderSquare = () => {
    const square = props.value
    // console.log(square)
    return (
      <>
        {square.map((square) => {
          return (
            <div className="board-row">
              {square.map((array) => {
                return <Square value={array} onClick={props.onClick} />
              })}
            </div>
          )
        })}
      </>
    )
  }
  return renderSquare()
}
export default Board
