import React, { useState, useEffect } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import getClickedIndex from './util/getClickedIndex'
import check from './util/findIsPutStone'
import isCheckPutStonePlace from './util/isCheckPutStonePlace'
import checkStoneCount from './util/checkStoneCount'
import './index.css'
import checkWinner from './util/checkWinner'

const App = () => {
  const [blackIsNext, setBlackIsNext] = useState(false)
  const [blackStoneCount, setBlackStoneCount] = useState(0)
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)
  const [flag, setFlag] = useState(true)
  const [message, setMessage] = useState()
  const [winner, setWinner] = useState('')
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })

  useEffect(() => {
    const arrayIndex = []
    const stone = blackIsNext ? '○' : '●'
    const squares = document.querySelectorAll('.square')
    // eslint-disable-next-line
    const [rowIndex, colIndex, hougaku] = check(
      history.history[0].square,
      stone
    )

    for (const [index, item] of rowIndex.entries()) {
      const rowNum = item * 8
      const colNum = colIndex[index]
      arrayIndex.push(rowNum + colNum)
    }
    for (const item of arrayIndex) {
      for (const [index, square] of squares.entries()) {
        if (index === item) {
          square.id = 'canClick'
        }
      }
    }
    if (flag === false && arrayIndex.length === 0) {
      setWinner(checkWinner(blackStoneCount, whiteStoneCount))
    }

    if (arrayIndex.length === 0 && flag === true) {
      setFlag(false)
      setBlackIsNext(!blackIsNext)
      setMessage(`${stone}スキップされました`)
    }
    const stoneCount = checkStoneCount()
    setBlackStoneCount(stoneCount[0])
    setWhiteStoneCount(stoneCount[1])
    // eslint-disable-next-line
  }, [blackIsNext])

  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`
  const handleClick = (event) => {
    setMessage('')
    const squares = document.querySelectorAll('.square')
    const stone = blackIsNext ? '○' : '●'
    const slicedHistory = history.history.slice()
    const currant = slicedHistory[slicedHistory.length - 1]
    const square = currant.square
    const index = getClickedIndex(event, squares)
    if (isCheckPutStonePlace(index, squares)) {
      setWinner('')
      for (const square of squares) {
        square.removeAttribute('id')
      }
      const rowIndex = Math.floor(index / 8)
      const colIndex = index % 8
      square[rowIndex][colIndex] = stone
      setHistory({ history: [{ square: square }] })
      setBlackIsNext(!blackIsNext)
      setFlag(true)
    }
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board value={history.history[0].square} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <p>{message}</p>
        <p>黒の石の数:{blackStoneCount}</p>
        <p>白の石の数:{whiteStoneCount}</p>
        <p>{winner}</p>
      </div>
    </div>
  )
}
export default App
