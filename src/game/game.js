import React, { useState, useEffect, useReducer, useRef } from 'react'
import Board from '../board/Board'
import INIT_BOARD from '../util/initBoard'
import getClickedIndex from '../util/getClickedIndex'
import check from '../util/findIsPutStone'
import isCheckPutStonePlace from '../util/isCheckPutStonePlace'
import checkStoneCount from '../util/checkStoneCount'
import '../index.css'
import checkWinner from '../util/checkWinner'
import reverseStone from '../util/reverseStone'
import addAnimationId from '../util/addAnimationId'
import getDom from '../util/getDom'
import socketIOClient from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
const ENDPOINT = 'http://localhost:80'

const Game = ({ route, navigation }) => {
  const socketRef = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  const test = (state, selector) => {
    if (state === undefined) {
      return
    } else {
      return state.concat(getDom(selector))
    }
  }

  const [rowIndex, setRowIndex] = useState()
  const [colIndex, setColIndex] = useState()
  const [hougaku, setHougaku] = useState()
  const [blackIsNext, setBlackIsNext] = useState(false)
  const [blackStoneCount, setBlackStoneCount] = useState(0)
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)
  const [flag, setFlag] = useState(true)
  const [removeFlag, setRemoveFlag] = useState(false)
  const [message, setMessage] = useState()
  const [winner, setWinner] = useState('')
  const [count, setCount] = useState(0)
  const [squaresDom, setSquaresDom] = useReducer(test, [])
  const [stepNumber, setStepNumber] = useState(0)
  const [jumpFlag, setJumpFlag] = useState(false)
  const [notReverseHistory, setNotReverseHistory] = useState({
    notReverseHistory: [
      {
        notReverseSquare: INIT_BOARD
      }
    ]
  })

  const [reverseIndex, setReverseIndex] = useState([])
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD
      }
    ]
  })

  useEffect(() => {
    console.log('render')
    socketRef.current = socketIOClient(ENDPOINT)
    let test = true

    socketRef.current.emit('join-room', {
      roomName: location.state.roomName,
      playerName: location.state.playerName
    })

    socketRef.current.on('over-notice', () => {
      console.log('over')
      navigate(-1)
    })

    const element = getDom('.square')
    for (const elm of element) {
      elm.addEventListener('transitionend', event => {
        if (/test/.test(event.target.parentNode.className)) {
          setTimeout(() => {
            event.target.parentNode.children[1].classList.add('none')
            event.target.parentNode.classList.add('penis')
            event.target.parentNode.classList.remove('test')
            event.target.parentNode.classList.remove('reverse')
          }, 100)
        }
      })
    }
  }, [])
  useEffect(() => {
    const arrayIndex = []
    const stone = blackIsNext ? '○' : '●'
    const [rowIndex, colIndex, hougaku] = check(
      history.history[stepNumber].square,
      stone
    )
    for (const [index, item] of rowIndex.entries()) {
      const rowNum = item * 8
      const colNum = colIndex[index]
      arrayIndex.push(rowNum + colNum)
    }
    if (squaresDom[stepNumber - 1]) {
      for (const item of arrayIndex) {
        for (const [index, squareDom] of squaresDom[stepNumber - 1].entries()) {
          if (index === item) {
            squareDom.id = 'canClick'
          }
        }
      }
    } else {
      const squaresDom = getDom('.square')
      for (const item of arrayIndex) {
        for (const [index, squareDom] of squaresDom.entries()) {
          if (index === item) {
            squareDom.id = 'canClick'
          }
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
    const stoneCount = checkStoneCount(history.history[stepNumber].square)
    setBlackStoneCount(stoneCount[0])
    setWhiteStoneCount(stoneCount[1])
    setRowIndex(rowIndex)
    setColIndex(colIndex)
    setHougaku(hougaku)
    setSquaresDom('.square')
  }, [blackIsNext])

  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`

  const handleClick = event => {
    clickFunction(event)
  }

  const clickFunction = event => {
    setMessage('')
    const stone = blackIsNext ? '○' : '●'
    const slicedHistory = JSON.parse(
      JSON.stringify(history.history.slice(0, stepNumber + 1))
    )
    const notReverseSlicedHistory = JSON.parse(
      JSON.stringify(
        notReverseHistory.notReverseHistory.slice(0, stepNumber + 1)
      )
    )
    const currant = JSON.parse(
      JSON.stringify(slicedHistory[slicedHistory.length - 1])
    )
    const square = JSON.parse(JSON.stringify(currant.square.slice()))
    const index = getClickedIndex(event, squaresDom[stepNumber])
    if (isCheckPutStonePlace(index, squaresDom[stepNumber])) {
      setCount(count + 1)
      setWinner('')
      setJumpFlag(false)
      const clickedRowIndex = Math.floor(index / 8)
      const clickedColIndex = index % 8
      const [changedSquares, notReverseSquare] = reverseStone(
        clickedRowIndex,
        clickedColIndex,
        hougaku,
        rowIndex,
        colIndex,
        square,
        stone
      )
      const reverseIndexes = addAnimationId(
        stone,
        history.history[stepNumber].square,
        changedSquares
      )

      setHistory({
        history: slicedHistory.concat([{ square: changedSquares }])
      })
      setNotReverseHistory({
        notReverseHistory: notReverseSlicedHistory.concat([
          { notReverseSquare: notReverseSquare }
        ])
      })
      setReverseIndex(reverseIndexes)
      setBlackIsNext(!blackIsNext)
      setFlag(true)
      setStepNumber(slicedHistory.length)
      setRemoveFlag(false)
      for (const squareDom of squaresDom[stepNumber]) {
        squareDom.removeAttribute('id')
      }
    }
  }

  const jump = () => {
    let step = stepNumber - 1
    if (step < 0) {
      return
    }
    // addAnimationId()
    setJumpFlag(true)
    setCount(count + 1)
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
    for (const squareDom of squaresDom[stepNumber]) {
      squareDom.removeAttribute('id')
    }
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
          value={
            jumpFlag
              ? history.history[stepNumber].square
              : notReverseHistory.notReverseHistory[stepNumber].notReverseSquare
          }
          onClick={handleClick}
          count={count}
          reverseIndex={reverseIndex}
          flag={jumpFlag}
          blackIsNext={blackIsNext}
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
      <div className='box'></div>
    </div>
  )
}
export default Game
