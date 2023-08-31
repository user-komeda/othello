import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 *
 * @param props room情報(playerName,roomName)
 */
const Room = (props) => {
  const navigate = useNavigate()
  const roomObjectList = []
  // eslint-disable-next-line react/prop-types
  for (const value of props.value) {
    // valueIndex=1
    roomObjectList.push(value[1].roomObject)
  }

  const handleClick = (event) => {
    const targetElement = event.currentTarget
    console.log(targetElement)
    const roomName = targetElement.querySelector('#roomName').textContent
    const playerName = targetElement.querySelector('#playerName').textContent
    const roomInfo = {
      roomName: roomName,
      playerName: playerName,
    }
    navigate(`/game?${roomName}`, {
      state: roomInfo,
    })
  }

  return (
    <div>
      {/* 重複削除 */}
      {roomObjectList.map((roomObject, key, roomObjectList) => {
        if (
          key > 0 &&
          roomObjectList[key - 1].roomName === roomObject.roomName
        ) {
          return
        }
        return (
          <div key={key} onClick={handleClick}>
            <span>playerName:</span>
            <spa id="playerName">{roomObject.playerName}</spa>
            <span>roomName:</span>
            <span id="roomName">{roomObject.roomName}</span>
          </div>
        )
      })}
    </div>
  )
}
export default Room
