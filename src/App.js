import React, { useState, useEffect } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import getClickedIndex from './util/getClickedIndex'
import check from './util/findIsPutStone'
import isCheckPutStonePlace from './util/isCheckPutStonePlace'
import checkStoneCount from './util/checkStoneCount'
import './index.css'
import checkWinner from './util/checkWinner'
import reverseStone from './util/reverseStone'

const App = () => {
  const [rowIndex, setRowIndex] = useState()
  const [colIndex, setColIndex] = useState()
  const [hougaku, setHougaku] = useState()
  const [blackIsNext, setBlackIsNext] = useState(false)
  const [blackStoneCount, setBlackStoneCount] = useState(0)
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)
  const [flag, setFlag] = useState(true)
  const [message, setMessage] = useState()
  const [winner, setWinner] = useState('')
  const [stepNumber, setStepNumber] = useState(0)
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD
      }
    ]
  })

  useEffect(() => {
    const squares = document.querySelectorAll('.square')
    for (const square of squares) {
      square.removeAttribute('id')
    }

    const arrayIndex = []
    const stone = blackIsNext ? '○' : '●'
    // eslint-disable-next-line
    const [rowIndex, colIndex, hougaku] = check(
      history.history[stepNumber].square,
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
    setRowIndex(rowIndex)
    setColIndex(colIndex)
    setHougaku(hougaku)
    // setStepNumber(history.length)
    // eslint-disable-next-line
  }, [blackIsNext])

  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`
  const handleClick = event => {
    setMessage('')
    const squares = document.querySelectorAll('.square')
    const stone = blackIsNext ? '○' : '●'
    const slicedHistory = JSON.parse(
      JSON.stringify(history.history.slice(0, stepNumber + 1))
    )
    // console.log(slicedHistory)
    const currant = JSON.parse(
      JSON.stringify(slicedHistory[slicedHistory.length - 1])
    )
    // console.log(currant)
    const square = JSON.parse(JSON.stringify(currant.square.slice()))
    // console.log(square)
    const index = getClickedIndex(event, squares)
    if (isCheckPutStonePlace(index, squares)) {
      setWinner('')
      for (const square of squares) {
        square.removeAttribute('id')
      }
      const clickedRowIndex = Math.floor(index / 8)
      const clickedColIndex = index % 8
      const changedSquare = reverseStone(
        clickedRowIndex,
        clickedColIndex,
        hougaku,
        rowIndex,
        colIndex,
        square,
        stone
      )
      // console.log(changedSquare)
      setHistory({ history: slicedHistory.concat([{ square: changedSquare }]) })
      setBlackIsNext(!blackIsNext)
      setFlag(true)
      setStepNumber(slicedHistory.length)
    }
  }

  const jump = () => {
    let step = stepNumber - 1
    if (step < 0) {
      return
    }
    if (message !== '') {
      let step = stepNumber - 2
      setStepNumber(step)
      setBlackIsNext(!blackIsNext)
      setMessage('')
    } else {
      setStepNumber(step)
      setBlackIsNext(stepNumber % 2 === 0)
      setMessage('')
    }
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
          value={history.history[stepNumber].square}
          onClick={handleClick}
        />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <p>{message}</p>
        <p>黒の石の数:{blackStoneCount}</p>
        <p>白の石の数:{whiteStoneCount}</p>
        <p>{winner}</p>
        <button onClick={jump}>待った</button>
      </div>
    </div>
  )
}
export default App
