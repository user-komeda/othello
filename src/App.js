import React, { useState, useEffect } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import './index.css'

const App = () => {
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })
  const [xIsNext, setxIsNext] = useState(true)
  const [stepNumber, setStepNumber] = useState(0)
  // console.log(INIT_BOARD)
  console.log(history.history[0])
  return (
    <div className="game">
      <div className="game-board">
        <Board value={history.history[0].square} />
      </div>
      <div className="game-info"></div>
    </div>
  )
}
export default App
