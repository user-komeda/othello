import { useCallback, useEffect, useState } from 'react'
import { OTHELLO_VALUE, useWebSocketValueKey } from '../const'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://localhost:80'
import getDom from '../util/getDom'

/**
 *
 * @param {*} socketRef
 * @param {*} location
 * @param {*} navigate
 * @returns
 */
const useSocketHook = (socketRef, location, navigate) => {
  /**
   *'history',
   *'myStoneColor',
   *'notReverseHistory',
   *'stepNumber',
   *'blackIsNext',
   *'reverseIndex',
   *'player',
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

  const [update, setUpdata] = useState(false)
  // レンダリングしたい場所でこれを差し込むだけ

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
      const slicedHistory = JSON.parse(
        JSON.stringify(
          prev.notReverseHistory.body.slice(0, prev.stepNumber + 1)
        )
      )

      updateValue.history = {
        body: slicedHistory.concat([{ square: value }]),
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

      const notReverseSlicedHistory = JSON.parse(
        JSON.stringify(
          prev.notReverseHistory.body.slice(0, prev.stepNumber + 1)
        )
      )
      console.log(notReverseSlicedHistory)
      updateValue.notReverseHistory = {
        body: notReverseSlicedHistory.concat([{ notReverseSquare: value }]),
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

      socketRef.current.emit('join-room', {
        roomName: roomName,
        playerName: playerName,
      })

      socketRef.current.on('disconnect', (reason) => {})

      socketRef.current.on('change-mode', (roomObject) => {
        const stoneColor = roomObject.blackIsNext ? '○' : '●'
        setMyStoneColor(stoneColor)
      })

      socketRef.current.on('over-notice', () => {
        navigate(-1)
      })

      socketRef.current.on('update-piece', (value) => {
        console.log(value)
        setHistoryValue(value.history)
        setNotReverseHistory(value.notReverseHistory)

        setStepNumber(value.stepNumber)
        setBlackIsNext(!value.blackIsNext)
        setReverseIndex(value.reverseIndex)
        setPlayer(1)
        // setUpdata(update ? false : true)
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
