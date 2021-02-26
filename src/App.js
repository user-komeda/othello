import React, { useState, useEffect } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import getClickedIndex from './util/getClickedIndex'
import './index.css'

const App = () => {
  const [button, setButton] = useState()
  useEffect(() => {
    console.log('aa')
    setButton(() => {
      return document.querySelectorAll('.square')
    })
  }, [])
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })
  const [blackIsNext, setBlackIsNext] = useState(false)
  const [stepNumber, setStepNumber] = useState(0)
  // console.log(INIT_BOARD)
  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`
  const handleClick = (event) => {
    const stone = blackIsNext ? '○' : '●'
    const slicedHistory = history.history.slice()
    const currant = slicedHistory[slicedHistory.length - 1]
    const square = currant.square
    const index = getClickedIndex(event, button)
    const rowIndex = Math.floor(index / 8)
    const colIndex = index % 8
    square[rowIndex][colIndex] = stone
    console.log(square)
    setHistory({ history: [{ square: square }] })
    setBlackIsNext(!blackIsNext)
  }
  return (
    <div className="game">
      {console.log(history)}
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
