/* global process*/

import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { PropTypes } from 'prop-types'

/**
 * @param props a
 */
const Square = (props) => {
  const element = useRef(null)
  const WHITE_COMA = `${process.env.PUBLIC_URL}img/disk_blue.png`
  const BLACK_COMA = `${process.env.PUBLIC_URL}img/disk_pink.png`
  let coma = ''
  if (props.value === '●') {
    coma = BLACK_COMA
  } else if (props.value === '○') {
    coma = WHITE_COMA
  }

  // アニメーション設定
  useEffect(() => {
    element.current.classList.remove('test')
    if (props.flag && element.current.children[0].firstChild && props.flag) {
      // 表画像の属性取得
      const frontImgSrc =
        element.current.children[0].firstChild.getAttribute('src')

      // 裏画像の属性取得
      const backImgSrc =
        element.current.children[1].firstChild.getAttribute('src')

      // アニメーション設定
      switch (props.blackIsNext ? '○' : '●') {
        case '○':
          switch (props.value) {
            case '○':
              console.log(element.current)
              if (/pink/.test(frontImgSrc)) {
                element.current.children[1].classList.remove('none')
              } else if (/blue/.test(frontImgSrc)) {
                element.current.children[1].classList.add('none')
              }
              break
            case '●':
              element.current.children[1].classList.remove('none')
              break
            default:
              break
          }
          break
        case '●':
          console.log('black')
          switch (props.value) {
            case '○':
              element.current.children[1].classList.remove('none')
              break
            case '●':
              if (/pink/.test(backImgSrc)) {
                element.current.children[1].classList.remove('none')
              } else if (/blue/.test(backImgSrc)) {
                element.current.children[1].classList.add('none')
              }
              break
            default:
              break
          }
          break
        default:
          break
      }
    } else {
      element.current.children[1].classList.remove('none')
      if (/reverse/.test(props.className)) {
        element.current.classList.add('test')
        setTimeout(() => {
          element.current.classList.add(props.className)
        }, 500)
      }
    }
  }, [props.count])

  return (
    <button
      ref={element}
      className={classNames('square')}
      onClick={props.onClick}
    >
      <div className="front">
        {props.value && (
          <img src={coma === BLACK_COMA ? WHITE_COMA : BLACK_COMA} />
        )}
      </div>
      <div className="back">{props.value && <img src={coma} />}</div>
    </button>
  )
}

Square.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
  flag: PropTypes.bool,
  onClick: PropTypes.func,
  blackIsNext: PropTypes.bool,
  value: PropTypes.array,
}

export default Square
