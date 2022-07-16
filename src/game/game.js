import React, { useState, useEffect, useReducer, useRef } from 'react'
import Board from '../board/Board'
import getClickedIndex from '../util/getClickedIndex'
import check from '../util/findIsPutStone'
import isCheckPutStonePlace from '../util/isCheckPutStonePlace'
import checkStoneCount from '../util/checkStoneCount'
import '../index.css'
import checkWinner from '../util/checkWinner'
import reverseStone from '../util/reverseStone'
import getReverseIndex from '../util/getReverseIndex'
import getDom from '../util/getDom'
import { useLocation, useNavigate } from 'react-router-dom'
import addCanClickId from '../util/addCanClickId'
import { INIT_BOARD, OTHELLO_VALUE } from '../const'
import useSocketHook from '../customHook/useSocketHook'
let tmpRowIndex = []
let tmpColIndex = []
let tmpHougaku = []
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

  const [blackStoneCount, setBlackStoneCount] = useState(0)
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)
  const [skipFlag, setSkipFlag] = useState(true)
  const [message, setMessage] = useState()
  const [winner, setWinner] = useState('')
  const [squaresDom, setSquaresDom] = useReducer(test, [])
  const [jumpFlag, setJumpFlag] = useState(false)

  const [
    useWebSocketValue,
    initialSocket,
    domEvent,
    exportFunctions,
  ] = useSocketHook(socketRef, location, navigate)

  initialSocket()
  domEvent()

  useEffect(() => {
    const arrayIndex = []
    const stone = useWebSocketValue.blackIsNext ? '○' : '●'
    const stepNumber = useWebSocketValue.stepNumber
    const square = useWebSocketValue.history.history[stepNumber].square
    const tmpSquaresDom =
      squaresDom.length === 0 ? getDom('.square') : squaresDom[stepNumber - 1]
    for (const squareDom of tmpSquaresDom) {
      squareDom.removeAttribute('id')
    }

    const [rowIndex, colIndex, hougaku] = check(square, stone)
    addCanClickId(rowIndex, colIndex, arrayIndex, tmpSquaresDom)

    if (skipFlag === false && arrayIndex.length === 0) {
      setWinner(checkWinner(blackStoneCount, whiteStoneCount))
    }

    if (arrayIndex.length === 0 && skipFlag === true) {
      setSkipFlag(false)
      exportFunctions.setBlackIsNext(!useWebSocketValue.blackIsNext)
      setMessage(`${stone}スキップされました`)
    }
    const stoneCount = checkStoneCount(square)
    setBlackStoneCount(stoneCount[0])
    setWhiteStoneCount(stoneCount[1])
    tmpRowIndex = rowIndex
    tmpColIndex = colIndex
    tmpHougaku = hougaku
    setSquaresDom('.square')
  }, [useWebSocketValue.blackIsNext])

  const status = `Next Player is ${
    useWebSocketValue.blackIsNext ? 'white' : 'black'
  }`

  const handleClick = event => {
    clickFunction(event, useWebSocketValue.myStoneColor)
  }

  const clickFunction = (event, myStoneColor) => {
    setMessage('')

    const stone = useWebSocketValue.blackIsNext ? '○' : '●'
    if (stone !== myStoneColor) {
      return
    }
    const stepNumber = useWebSocketValue.stepNumber
    const slicedHistory = JSON.parse(
      JSON.stringify(useWebSocketValue.history.history.slice(0, stepNumber + 1))
    )

    const currant = JSON.parse(
      JSON.stringify(slicedHistory[slicedHistory.length - 1])
    )
    const square = JSON.parse(JSON.stringify(currant.square.slice()))
    const index = getClickedIndex(event, squaresDom[stepNumber])
    if (isCheckPutStonePlace(index, squaresDom[stepNumber])) {
      setWinner('')
      setJumpFlag(false)
      const clickedRowIndex = Math.floor(index / 8)
      const clickedColIndex = index % 8
      const [changedSquares, notReverseSquare] = reverseStone(
        clickedRowIndex,
        clickedColIndex,
        tmpHougaku,
        tmpRowIndex,
        tmpColIndex,
        square,
        stone
      )
      const reverseIndexes = getReverseIndex(
        stone,
        useWebSocketValue.history.history[stepNumber].square,
        changedSquares
      )
      setSkipFlag(true)

      exportFunctions.setHistoryValue(changedSquares)
      exportFunctions.setNotReverseHistory(notReverseSquare)
      exportFunctions.setReverseIndex(reverseIndexes)
      exportFunctions.setBlackIsNext(!useWebSocketValue.blackIsNext)
      exportFunctions.setStepNumber(slicedHistory.length)
      exportFunctions.setPlayer(0)
      socketRef.current.emit('abc', {
        history: changedSquares,
        notReverseHistory: notReverseSquare,
        stepNumber: stepNumber + 1,
        blackIsNext: useWebSocketValue.blackIsNext,
        flag: jumpFlag,
        reverseIndex: reverseIndexes,
      })
    }
  }

  // const jump = () => {
  //   const step = stepNumber - 1
  //   if (step < 0) {
  //     return
  //   }
  //   // addAnimationId()
  //   setJumpFlag(true)
  //   if (message !== '') {
  //     const step = stepNumber - 2
  //     setStepNumber(step)
  //     setBlackIsNext(!blackIsNext)
  //     setMessage('')
  //   } else {
  //     setStepNumber(step)
  //     setBlackIsNext(stepNumber % 2 === 0)
  //     setMessage('')
  //   }
  //   for (const squareDom of squaresDom[stepNumber]) {
  //     squareDom.removeAttribute('id')
  //   }
  // }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board
          value={
            jumpFlag
              ? useWebSocketValue.history.history[useWebSocketValue.stepNumber]
                  .square
              : useWebSocketValue.notReverseHistory.notReverseHistory[
                  useWebSocketValue.stepNumber
                ].notReverseSquare
          }
          onClick={handleClick}
          player={useWebSocketValue.player}
          reverseIndex={useWebSocketValue.reverseIndex}
          flag={jumpFlag}
          blackIsNext={useWebSocketValue.blackIsNext}
        />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <p>{message}</p>
        <p>黒の石の数:{blackStoneCount}</p>
        <p>白の石の数:{whiteStoneCount}</p>
        <p>{winner}</p>
        {/* <button onClick={jump}>待った</button> */}
      </div>
      <div className='box'></div>
    </div>
  )
}
export default Game
