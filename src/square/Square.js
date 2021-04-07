import React from 'react'

const Square = props => {
  let coma = ''
  if (props.value === '●') {
    coma = `${process.env.PUBLIC_URL}img/disk_blue.png`
  } else if (props.value === '○') {
    coma = `${process.env.PUBLIC_URL}img/disk_pink.png`
  }
  return (
    <button className='square' onClick={props.onClick}>
      {props.value&&<img src={coma}/>}
    </button>
  )
}
export default Square
