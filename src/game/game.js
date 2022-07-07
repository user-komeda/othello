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

/**
 *
 * @param root0
 * @param root0.route
 * @param root0.navigation
 */
const Game = () => {
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
  const [myStoneColor, setMyStoneColor] = useState()
  // const [status, setStatus] = useState()
  const [blackStoneCount, setBlackStoneCount] = useState(0)
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)
  const [flag, setFlag] = useState(true)
  const [message, setMessage] = useState()
  const [winner, setWinner] = useState('')
  const [count, setCount] = useState(0)
  const [squaresDom, setSquaresDom] = useReducer(test, [])
  const [stepNumber, setStepNumber] = useState(0)
  const [jumpFlag, setJumpFlag] = useState(false)
  const [notReverseHistory, setNotReverseHistory] = useState({
    notReverseHistory: [
      {
        notReverseSquare: INIT_BOARD,
      },
    ],
  })

  const [reverseIndex, setReverseIndex] = useState([])
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })

  useEffect(() => {
    console.log(history)
    console.log('render')
    socketRef.current = socketIOClient(ENDPOINT, {
      withCredentials: true,
    })
    socketRef.current.on('connect', () => {
      console.log(socketRef.current.id)
    })

    const roomName = location.state.roomName
    const playerName = location.state.playerName

    socketRef.current.emit('join-room', {
      roomName: roomName,
      playerName: playerName,
    })

    socketRef.current.on('disconnect', reason => {
      console.log(reason)
    })

    socketRef.current.on('change-mode', roomObject => {
      console.log('insert')
      const stoneColor = roomObject.blackIsNext ? '○' : '●'
      setMyStoneColor(stoneColor)
    })

    socketRef.current.on('over-notice', () => {
      console.log('over')
      navigate(-1)
    })

    socketRef.current.on('update-piece', value => {
      console.log(value.value.history)
      setHistory({ history: value.value.history })
      setNotReverseHistory({
        notReverseHistory: value.value.notReverseHistory,
      })
      setStepNumber(value.value.stepNumber)
      console.log(notReverseHistory)
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
    clickFunction(event, myStoneColor)
    console.log(myStoneColor)
  }

  const clickFunction = (event, myStoneColor) => {
    setMessage('')

    const stone = blackIsNext ? '○' : '●'
    if (stone !== myStoneColor) {
      return
    }

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
        history: slicedHistory.concat([{ square: changedSquares }]),
      })
      setNotReverseHistory({
        notReverseHistory: notReverseSlicedHistory.concat([
          { notReverseSquare: notReverseSquare },
        ]),
      })
      setReverseIndex(reverseIndexes)
      setBlackIsNext(!blackIsNext)
      setFlag(true)
      setStepNumber(slicedHistory.length)
      for (const squareDom of squaresDom[stepNumber]) {
        squareDom.removeAttribute('id')
      }
      console.log('aaa')
      socketRef.current.emit('abc', {
        history: [{ square: changedSquares }],
        notReverseHistory: [{ notReverseSquare: notReverseSquare }],
        stepNumber: stepNumber + 1,
      })
    }
  }

  const jump = () => {
    const step = stepNumber - 1
    if (step < 0) {
      return
    }
    // addAnimationId()
    setJumpFlag(true)
    setCount(count + 1)
    if (message !== '') {
      const step = stepNumber - 2
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
        {console.dir(notReverseHistory)}
        <Board
          value={
            jumpFlag
              ? history.history[0].square
              : notReverseHistory.notReverseHistory[0].notReverseSquare
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
