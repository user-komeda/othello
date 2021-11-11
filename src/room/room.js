import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Room = props => {
  console.log(props.test)
  console.log(props.value)

  const navigate = useNavigate()

  const handleClick = event => {
    console.log(event.currentTarget.children)
    const playerName = JSON.parse(Array.from(props.value)[0][1])['playerName']
    const roomName = Array.from(props.value)[0][0]

    const roomInfo = {
      roomName: roomName,
      playerName: playerName
    }
    navigate(`/game?${roomName}`, {
      state: roomInfo
    })
  }

  return (
    <div>
      {props.value.size !== 0
        ? Array.from(props.value).map(([key, value]) => {
            return (
              <div onClick={handleClick}>
                <p>{key}</p>
                <p>{value}</p>
              </div>
            )
          })
        : ''}
    </div>
  )
}
export default Room
