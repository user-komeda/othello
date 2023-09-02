import { useState, useEffect, useRef } from 'react'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Room from '../room/room'

/**
 *
 */
const Home = () => {
  const [inputRoomNameState, setInputRoomNameState] = useState('')
  const [inputNameState, setInputNameState] = useState('')
  const [roomInfoMap, setRoomInfoMapState] = useState(new Map())
  // eslint-disable-next-line no-unused-vars
  const [_, setIsLoading] = useState(false)

  const socketRef = useRef()

  useEffect(() => {
    setIsLoading(true)
    axios.get('http://localhost').then((response) => {
      setRoomInfoMapState(() => {
        for (const dataKey of Object.keys(response.data)) {
          roomInfoMap.set(dataKey, response.data[dataKey])
        }
        return roomInfoMap
      })
      setIsLoading(false)
    })
  }, [])

  const history = useNavigate()

  const handleRoomNameChange = (event) => {
    setInputRoomNameState(event.target.value)
  }

  const handleNameChange = (event) => {
    setInputNameState(event.target.value)
  }

  const handleClick = () => {
    const roomInfo = {
      roomName: inputRoomNameState,
      playerName: inputNameState,
    }

    history(`/game?${inputRoomNameState}`, {
      state: roomInfo,
      socket: socketRef.current,
    })
  }

  return (
    <div id="create-room">
      <Room value={roomInfoMap} socket={socketRef.current}></Room>

      <h1>オンラインWSリバーシ</h1>
      <h2>ルーム作成･参加</h2>
      <div className="room-create-form">
        <div>
          <label>ルーム名称:</label>
          <input id="roomName" type="text" onChange={handleRoomNameChange} />
          <br />
          <label>プレイヤーの名前:</label>
          <input id="playerName" type="text" onChange={handleNameChange} />
        </div>
        <div>
          <button id="send-btn" type="submit" onClick={handleClick}>
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
