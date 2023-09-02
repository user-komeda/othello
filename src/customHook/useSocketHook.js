import { useEffect, useState } from 'react'
import { OTHELLO_VALUE, useWebSocketValueKey } from '../const'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://localhost:80'
import getDom from '../util/getDom'

/**
 *
 * @param {*} socketRef socketRef
 * @param {*} location location
 * @param {*} navigate navigate
 */
const useSocketHook = (socketRef, location, navigate) => {
  /**
   *'boardHistory',
   *'myStoneColor',
   *'notReversedBoardHistory',
   *'stepNumber',
   *'blackIsNext',
   *'reverseIndex',
   *'player',
   *'isGameStart',
   */
  const [useWebSocketValue, setUseWebSocketValue] = useState(
    // OTHELLO_VALUE
    Object.keys(OTHELLO_VALUE)
      .filter((value) => {
        return useWebSocketValueKey.includes(value)
      })
      .reduce((obj, value) => {
        return Object.assign(obj, { [value]: OTHELLO_VALUE[value] })
      }, {})
  )

  const domEvent = () => {
    useEffect(() => {
      const element = getDom('.square')
      for (const elm of element) {
        elm.addEventListener('transitionend', (event) => {
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
  }

  const setHistoryValue = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      const slicesBoardHistory = JSON.parse(
        JSON.stringify(
          prev.notReversedBoardHistory.body.slice(0, prev.stepNumber + 1)
        )
      )

      updateValue.boardHistory = {
        body: slicesBoardHistory.concat([{ boardInfo: value }]),
      }
      return updateValue
    })
  }

  const setMyStoneColor = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      updateValue.myStoneColor = value
      return updateValue
    })
  }

  const setNotReverseHistory = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)

      const notReversedSlicedBoardHistory = JSON.parse(
        JSON.stringify(
          prev.notReversedBoardHistory.body.slice(0, prev.stepNumber + 1)
        )
      )
      updateValue.notReversedBoardHistory = {
        body: notReversedSlicedBoardHistory.concat([
          { notReversedBoardInfo: value },
        ]),
      }
      return updateValue
    })
  }

  const setStepNumber = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      updateValue.stepNumber = value
      return updateValue
    })
  }

  const setBlackIsNext = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      updateValue.blackIsNext = value
      return updateValue
    })
  }

  const setReverseIndex = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      updateValue.reverseIndex = value
      return updateValue
    })
  }

  const setPlayer = (value) => {
    setUseWebSocketValue((prev) => {
      const updateValue = Object.assign({}, prev)
      updateValue.player = value

      return updateValue
    })
  }

  const initialSocket = () => {
    useEffect(() => {
      socketRef.current = socketIOClient(ENDPOINT, {
        withCredentials: true,
      })
      socketRef.current.on('connect', () => {})

      const roomName = location.state.roomName
      const playerName = location.state.playerName
      console.log('join')
      socketRef.current.emit('join-room', {
        roomName: roomName,
        playerName: playerName,
      })

      socketRef.current.on('disconnect', (reason) => {})

      socketRef.current.on('change-mode', (roomObject) => {
        const stoneColor = roomObject.blackIsNext ? '○' : '●'
        setMyStoneColor(stoneColor)
        if (roomObject.mode === 'start') {
          setUseWebSocketValue((prev) => {
            const updateValue = Object.assign({}, prev)
            updateValue.isGameStart = true
            return updateValue
          })
          console.log('start')
          socketRef.current.emit('change-mode-start', {
            isGameStart: true,
          })
        }
      })

      socketRef.current.on('over-notice', () => {
        navigate(-1)
      })

      socketRef.current.on('change-mode-start', (isGameStart) => {
        setUseWebSocketValue((prev) => {
          const updateValue = Object.assign({}, prev)
          updateValue.isGameStart = true
          return updateValue
        })
      })

      socketRef.current.on('update-piece', (value) => {
        setHistoryValue(value.boardHistory)
        setNotReverseHistory(value.notReversedBoardHistory)
        setStepNumber(value.stepNumber)
        setBlackIsNext(!value.blackIsNext)
        setReverseIndex(value.reverseIndex)
        setPlayer(1)
      })
    }, [])
  }

  const exportFunctions = {
    setHistoryValue: setHistoryValue,
    setMyStoneColor: setMyStoneColor,
    setNotReverseHistory: setNotReverseHistory,
    setStepNumber: setStepNumber,
    setBlackIsNext: setBlackIsNext,
    setReverseIndex: setReverseIndex,
    setPlayer: setPlayer,
    initialSocket: initialSocket,
    domEvent: domEvent,
  }

  return [useWebSocketValue, initialSocket, domEvent, exportFunctions]
}

export default useSocketHook
