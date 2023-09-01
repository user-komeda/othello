import React, { useState, useEffect, useReducer, useRef } from 'react'
import Board from '../board/Board'
import getClickedIndex from '../util/getClickedIndex'
import findCanPutStoneIndex from '../util/findIsPutStone'
import isCheckPutStonePlace from '../util/isCheckPutStonePlace'
import checkStoneCount from '../util/checkStoneCount'
import '../index.css'
import checkWinner from '../util/checkWinner'
import reverseStone from '../util/reverseStone'
import getReverseIndex from '../util/getReverseIndex'
import getDom from '../util/getDom'
import { useLocation, useNavigate } from 'react-router-dom'
import addCanClickId from '../util/addCanClickId'
import useSocketHook from '../customHook/useSocketHook'
let tmpCanPutStoneRowIndexes = []
let tmpCanPutStoneColIndexes = []
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
  const [useWebSocketValue, initialSocket, domEvent, exportFunctions] =
    useSocketHook(socketRef, location, navigate)

  initialSocket()
  domEvent()

  useEffect(() => {
    const canPutStoneIndexes = []
    const stone = useWebSocketValue.blackIsNext ? '○' : '●'
    const stepNumber = useWebSocketValue.stepNumber
    const boardInfo = useWebSocketValue.boardHistory.body[stepNumber].boardInfo
    const tmpSquaresDom =
      squaresDom.length === 0 ? getDom('.square') : squaresDom[stepNumber - 1]
    for (const dom of tmpSquaresDom) {
      dom.removeAttribute('id')
    }

    const [canPutStoneRowIndexes, canPutStoneColIndexes, hougaku] =
      findCanPutStoneIndex(boardInfo, stone)
    addCanClickId(
      canPutStoneRowIndexes,
      canPutStoneColIndexes,
      canPutStoneIndexes,
      tmpSquaresDom
    )

    if (skipFlag === false && canPutStoneIndexes.length === 0) {
      setWinner(checkWinner(blackStoneCount, whiteStoneCount))
    }

    if (canPutStoneIndexes.length === 0 && skipFlag === true) {
      setSkipFlag(false)
      exportFunctions.setBlackIsNext(!useWebSocketValue.blackIsNext)
      setMessage(`${stone}スキップされました`)
    }
    const stoneCount = checkStoneCount(boardInfo)
    setBlackStoneCount(stoneCount[0])
    setWhiteStoneCount(stoneCount[1])
    tmpCanPutStoneRowIndexes = canPutStoneRowIndexes
    tmpCanPutStoneColIndexes = canPutStoneColIndexes
    tmpHougaku = hougaku
    setSquaresDom('.square')
  }, [useWebSocketValue.blackIsNext])

  const status = `Next Player is ${
    useWebSocketValue.blackIsNext ? 'white' : 'black'
  }`

  const handleClick = (event) => {
    clickFunction(event, useWebSocketValue.myStoneColor)
  }

  const clickFunction = (event, myStoneColor) => {
    setMessage('')

    const stone = useWebSocketValue.blackIsNext ? '○' : '●'
    if (stone !== myStoneColor) {
      return
    }
    const stepNumber = useWebSocketValue.stepNumber
    const slicedBoardHistory = JSON.parse(
      JSON.stringify(
        useWebSocketValue.boardHistory.body.slice(0, stepNumber + 1)
      )
    )

    const currant = JSON.parse(
      JSON.stringify(slicedBoardHistory[slicedBoardHistory.length - 1])
    )
    const boardInfo = JSON.parse(JSON.stringify(currant.boardInfo.slice()))
    const index = getClickedIndex(event, squaresDom[stepNumber])
    if (isCheckPutStonePlace(index, squaresDom[stepNumber])) {
      setWinner('')
      setJumpFlag(false)
      const clickedRowIndex = Math.floor(index / 8)
      const clickedColIndex = index % 8
      const [changedBoardInfo, notReversedBoardInfo] = reverseStone(
        clickedRowIndex,
        clickedColIndex,
        tmpHougaku,
        tmpCanPutStoneRowIndexes,
        tmpCanPutStoneColIndexes,
        boardInfo,
        stone
      )
      const reverseIndexes = getReverseIndex(
        stone,
        useWebSocketValue.boardHistory.body[stepNumber].boardInfo,
        changedBoardInfo
      )
      setSkipFlag(true)

      exportFunctions.setHistoryValue(changedBoardInfo)
      exportFunctions.setNotReverseHistory(notReversedBoardInfo)
      exportFunctions.setReverseIndex(reverseIndexes)
      exportFunctions.setBlackIsNext(!useWebSocketValue.blackIsNext)
      exportFunctions.setStepNumber(slicedBoardHistory.length)
      exportFunctions.setPlayer(0)
      socketRef.current.emit('put-piece', {
        boardHistory: changedBoardInfo,
        notReversedBoardHistory: notReversedBoardInfo,
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
    <div className="game">
      {console.dir(useWebSocketValue)}
      <div className="game-board">
        <Board
          value={
            jumpFlag
              ? useWebSocketValue.boardHistory.body[
                  useWebSocketValue.stepNumber
                ].boardInfo
              : useWebSocketValue.notReversedBoardHistory.body[
                  useWebSocketValue.stepNumber
                ].notReversedBoardInfo
          }
          onClick={handleClick}
          player={useWebSocketValue.player}
          reverseIndex={useWebSocketValue.reverseIndex}
          flag={jumpFlag}
          blackIsNext={useWebSocketValue.blackIsNext}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <p>{message}</p>
        <p>黒の石の数:{blackStoneCount}</p>
        <p>白の石の数:{whiteStoneCount}</p>
        <p>{winner}</p>
        {/* <button onClick={jump}>待った</button> */}
      </div>
      <div className="box"></div>
    </div>
  )
}
export default Game
