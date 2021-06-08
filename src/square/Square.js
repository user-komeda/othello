import React, { useState, useEffect, useReduce, useRef } from 'react'
import classNames from 'classnames'

const Square = props => {
  // const [count, setCount] = useState(0)
  const element = useRef(null)
  const WHITE_COMA = `${process.env.PUBLIC_URL}img/disk_blue.png`
  const BLACK_COMA = `${process.env.PUBLIC_URL}img/disk_pink.png`
  let coma = ''
  if (props.value === '●') {
    coma = BLACK_COMA
  } else if (props.value === '○') {
    coma = WHITE_COMA
  }
  useEffect(() => {
    // setCount(count + 1)
    // console.log(props.className)
    element.current.children[1].classList.remove('none')
    if (/reverse/.test(props.className)) {
      element.current.classList.add('test')
      setTimeout(() => {
        console.log('addreverse')
        element.current.classList.add(props.className)
      }, 500)
    }
  }, [props.count])

  return (
    <button
      ref={element}
      className={classNames('square', props.count)}
      onClick={props.onClick}
    >
      <div className='front'>
        {props.value && (
          <img src={coma === BLACK_COMA ? WHITE_COMA : BLACK_COMA} />
        )}
      </div>
      {/* {console.log(props.className)} */}
      <div className='back'>{props.value && <img src={coma} />}</div>
    </button>
  )
}
export default Square
