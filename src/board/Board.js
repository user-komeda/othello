import React from 'react'
import Square from '../square/Square'
const Board = props => {
  const square = props.value
  // console.log(square)
  return (
    <>
      {square.map((square, rowIndex) => {
        return (
          <div className='board-row'>
            {square.map((array, colIndex) => {
              return (
                <Square
                  value={array}
                  onClick={props.onClick}
                  count={props.count}
                  flag={props.flag}
                  blackIsNext={props.blackIsNext}
                  className={
                    props.reverseIndex.includes(rowIndex * 8 + colIndex)
                      ? 'reverse'
                      : ''
                  }
                />
              )
            })}
          </div>
        )
      })}
    </>
  )
}
export default Board
