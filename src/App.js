import React, { useState, useEffect } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import getClickedIndex from './util/getClickedIndex'
import check from './util/findIsPutStone'
import './index.css'

const App = () => {
  const [blackIsNext, setBlackIsNext] = useState(false)
  const [stepNumber, setStepNumber] = useState(0)
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })

  useEffect(() => {
    const stone = blackIsNext ? '○' : '●'
    const squares = document.querySelectorAll('.square')

    const [rowIndex, colIndex, hougaku] = check(
      history.history[0].square,
      stone
    )
    const arrayIndex = []
    for (const [index, item] of rowIndex.entries()) {
      const rowNum = item * 8
      const colNum = colIndex[index]
      arrayIndex.push(rowNum + colNum)
    }
    for (const item of arrayIndex) {
      for (const [index, square] of squares.entries()) {
        if (index === item) {
          square.classList.add('test')
        }
      }
    }
  }, [blackIsNext])

  // console.log(INIT_BOARD)
  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`
  const handleClick = (event) => {
    const squares = document.querySelectorAll('.square')
    for (const square of squares) {
      square.classList.remove('test')
    }
    const stone = blackIsNext ? '○' : '●'
    const slicedHistory = history.history.slice()
    const currant = slicedHistory[slicedHistory.length - 1]
    const square = currant.square
    const index = getClickedIndex(event, squares)
    const rowIndex = Math.floor(index / 8)
    const colIndex = index % 8
    square[rowIndex][colIndex] = stone
    setHistory({ history: [{ square: square }] })
    setBlackIsNext(!blackIsNext)
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board value={history.history[0].square} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  )
}
export default App
