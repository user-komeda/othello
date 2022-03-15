import React from 'react'
import Square from '../square/Square'
import { PropTypes } from 'prop-types'

/**
 * @param props
 */
const Board = (props) => {
  const square = props.value
  // console.log(square)
  return (
    <>
      {square.map((square, rowIndex) => {
        return (
          <div className="board-row" key={rowIndex}>
            {square.map((array, colIndex) => {
              return (
                <Square
                  key={colIndex}
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

Board.propTypes = {
  count: PropTypes.number,
  reverseIndex: PropTypes.array,
  flag: PropTypes.bool,
  onClick: PropTypes.func,
  blackIsNext: PropTypes.bool,
  value: PropTypes.array,
}

export default Board
