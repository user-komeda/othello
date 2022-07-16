import React from 'react'
import Square from '../square/Square'
import { PropTypes } from 'prop-types'

/**
 * @param props props
 */
const Board = props => {
  const square = props.value

  // if (!props.value) {
  //   return
  // }

  return (
    <>
      {square.map((square, rowIndex) => {
        return (
          <div className='board-row' key={rowIndex}>
            {square.map((array, colIndex) => {
              return (
                <Square
                  key={colIndex}
                  value={array}
                  onClick={props.onClick}
                  player={props.player}
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
  player: PropTypes.number,
  reverseIndex: PropTypes.array,
  flag: PropTypes.bool,
  onClick: PropTypes.func,
  blackIsNext: PropTypes.bool,
  value: PropTypes.array,
}

export default Board
