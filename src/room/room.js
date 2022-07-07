import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 *
 * @param props
 */
const Room = props => {
  const navigate = useNavigate()

  const roomObjectList = []
  // eslint-disable-next-line react/prop-types
  for (const value of props.value) {
    roomObjectList.push(value[1].roomObject)
  }
  const handleClick = event => {
    const targetElement = event.currentTarget
    const playerName = targetElement.childNodes[0].textContent
    const roomName = targetElement.childNodes[1].textContent
    console.log(playerName, roomName)
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
            <span>{roomObject.playerName}</span>
            <span>roomName:</span>
            <span>{roomObject.roomName}</span>
          </div>
        )
      })}
    </div>
  )
}
export default Room
