import React, { useState, useEffect, useReducer } from 'react'
import Board from './board/Board'
import INIT_BOARD from './util/initBoard'
import getClickedIndex from './util/getClickedIndex'
import check from './util/findIsPutStone'
import isCheckPutStonePlace from './util/isCheckPutStonePlace'
import checkStoneCount from './util/checkStoneCount'
import './index.css'
import checkWinner from './util/checkWinner'
import reverseStone from './util/reverseStone'
import addAnimationId from './util/addAnimationId'
import getDom from './util/getDom'

/**
 *
 */
const App = () => {
  // reducer
  const test = (state, selector) => {
    if (state === undefined) {
      return
    } else {
      return state.concat(getDom(selector))
    }
  }

  // 行インデックス
  const [rowIndex, setRowIndex] = useState()

  // 列インデックス
  const [colIndex, setColIndex] = useState()

  // 方角
  const [hougaku, setHougaku] = useState()

  // 次の手番黒
  const [blackIsNext, setBlackIsNext] = useState(false)

  // 黒石の数
  const [blackStoneCount, setBlackStoneCount] = useState(0)

  // 白石の数
  const [whiteStoneCount, setWhiteStoneCount] = useState(0)

  // フラグ
  const [flag, setFlag] = useState(true)

  // メッセージ
  const [message, setMessage] = useState()

  // 勝者
  const [winner, setWinner] = useState('')

  // カウント
  const [count, setCount] = useState(0)

  // マス目
  const [squaresDom, setSquaresDom] = useReducer(test, [])

  // 手番数
  const [stepNumber, setStepNumber] = useState(0)

  // パスフラグ
  const [jumpFlag, setJumpFlag] = useState(false)

  // ひっくり返す前の盤面
  const [notReverseHistory, setNotReverseHistory] = useState({
    notReverseHistory: [
      {
        notReverseSquare: INIT_BOARD,
      },
    ],
  })

  // ひっくり返す座標
  const [reverseIndex, setReverseIndex] = useState([])

  // 盤面
  const [history, setHistory] = useState({
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  })

  // アニメーション設定
  useEffect(() => {
    const element = getDom('.square')
    for (const elm of element) {
      elm.addEventListener('transitionend', (event) => {
        if (/test/.test(event.target.parentNode.className)) {
          setTimeout(() => {
            console.log(jumpFlag)
            event.target.parentNode.children[1].classList.add('none')
            event.target.parentNode.classList.remove('test')
            event.target.parentNode.classList.remove('reverse')
          }, 800)
        }
      })
    }
  }, [])

  // 盤面の初期設定
  useEffect(() => {
    const arrayIndex = []
    const stone = blackIsNext ? '○' : '●'
    const [rowIndex, colIndex, hougaku] = check(
      history.history[stepNumber].square,
      stone
    )

    // 石を置くことができる座標を配列に格納
    for (const [index, item] of rowIndex.entries()) {
      const rowNum = item * 8
      const colNum = colIndex[index]
      arrayIndex.push(rowNum + colNum)
    }

    console.log(arrayIndex)

    // 石を置けるマスにidを設定
    if (squaresDom[stepNumber - 1]) {
      for (const item of arrayIndex) {
        for (const [index, squareDom] of squaresDom[stepNumber - 1].entries()) {
          if (index === item) {
            console.log(item)
            console.log(index)
            squareDom.id = 'can-click'
          }
        }
      }
    } else {
      const squaresDom = getDom('.square')
      for (const item of arrayIndex) {
        for (const [index, squareDom] of squaresDom.entries()) {
          if (index === item) {
            console.log(item)
            console.log(index)
            squareDom.id = 'can-click'
          }
        }
      }
    }

    // skipされたかつおける箇所がなければ勝者判定
    if (flag === false && arrayIndex.length === 0) {
      setWinner(checkWinner(blackStoneCount, whiteStoneCount))
    }

    // おける箇所がなければスキップ
    if (arrayIndex.length === 0 && flag === true) {
      setFlag(false)
      setBlackIsNext(!blackIsNext)
      setMessage(`${stone}スキップされました`)
    }

    // 盤面更新時処理群
    const stoneCount = checkStoneCount(history.history[stepNumber].square)
    setBlackStoneCount(stoneCount[0])
    setWhiteStoneCount(stoneCount[1])
    setRowIndex(rowIndex)
    setColIndex(colIndex)
    setHougaku(hougaku)
    setSquaresDom('.square')
  }, [blackIsNext])

  const status = `Next Player is ${blackIsNext ? 'white' : 'black'}`

  /**
   * クリックイベント
   *
   * @param event event
   */
  const handleClick = (event) => {
    setMessage('')
    const stone = blackIsNext ? '○' : '●'

    // 現在の盤面
    const slicedHistory = JSON.parse(
      JSON.stringify(history.history.slice(0, stepNumber + 1))
    )

    // 一つ前の盤面
    const notReverseSlicedHistory = JSON.parse(
      JSON.stringify(
        notReverseHistory.notReverseHistory.slice(0, stepNumber + 1)
      )
    )

    // 現在の盤面
    const currant = JSON.parse(
      JSON.stringify(slicedHistory[slicedHistory.length - 1])
    )
    const square = JSON.parse(JSON.stringify(currant.square.slice()))

    // クリックした座標
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
    }
  }

  /**
   * 待った処理
   */
  const jump = () => {
    const step = stepNumber - 1
    if (step < 0) {
      return
    }
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
    <div className="game">
      <div className="game-board">
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
      <div className="game-info">
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
