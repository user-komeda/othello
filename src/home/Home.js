import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import Room from '../room/room'
const ENDPOINT = 'http://localhost:80'

const Home = () => {
  const [inputRoomState, setInputRoomState] = useState('')
  const [inputNameState, setInputNameState] = useState('')
  const [map, setRoomState] = useState(new Map())
  const [test, setTest] = useState([])
  const socketRef = useRef()

  useEffect(() => {
    // socketRef.current = socketIOClient(ENDPOINT)

    axios.get('http://localhost').then(response => {
      setRoomState(() => {
        for (const dataKey of Object.keys(response.data)) {
          map.set(dataKey, response.data[dataKey])
        }
        return map
      })
      setTest(() => {
        const tempMap = new Map()
        tempMap.set('test', 'tetst')
        return tempMap
      })
    })
  }, [])

  const history = useNavigate()

  const handleRoomNameChange = event => {
    setInputRoomState(event.target.value)
  }

  const handleNameChange = event => {
    setInputNameState(event.target.value)
  }

  const handleClick = () => {
    const roomInfo = {
      roomName: inputRoomState,
      playerName: inputNameState
    }

    // history.push({
    //   pathname: `/game?${inputRoomState}`,
    //   roomInfo: roomInfo
    // })

    history(`/game?${inputRoomState}`, {
      state: roomInfo,
      socket: socketRef.current
    })
  }

  const checkGameState = () => {
    // socketRef.current.on('change-mode', mode => {
    //   console.log(mode)
    //   if ((mode.mode = 'wait')) {
    //     // 対戦相手町中
    //   } else if ((mode.mode = 'start')) {
    //     //大戦中
    //   } else {
    //     console.warn('人数オーバーです')
    //   }
    // })
  }

  return (
    <div id='create-room'>
      <Room value={map} socket={socketRef.current} test={test}></Room>

      <h1>オンラインWSリバーシ</h1>
      <h2>ルーム作成･参加</h2>
      <div className='room-create-form'>
        <div>
          <input id='room-name' type='text' onChange={handleRoomNameChange} />
          <input id='playerName' type='text' onChange={handleNameChange} />
        </div>
        <div>
          <button id='send-btn' type='submit' onClick={handleClick}>
            作成･参加
          </button>
        </div>
      </div>
      <h2>説明</h2>
      <ul>
        <li>ルームの開設、既存のルームに参加が可能</li>
        <li>ルーム名は6文字以上12文字以下</li>
        <li>safari, chromeは動作確認済(ES6対応必須)</li>
      </ul>
      <h2>ルール</h2>
      <ul>
        <li>ルームホストが黒色で先攻</li>
        <li>置ける場所がなくなった場合、自動でターンをパス</li>
        <li>コマ数が０になった方は負けとする</li>
        <li>どちらかの接続が切れた場合はリセット</li>
      </ul>
      <h2>更新</h2>
      <ul>
        <li>2019/09/14: 公開</li>
        <li>2019/09/18: 修正</li>
      </ul>
    </div>
  )
}
export default Home
