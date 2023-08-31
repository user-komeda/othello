export const BLACK_STONE = '●'
export const WHITE_STONE = '○'
export const OTHELLO_ROW_SIZE = 8
export const OTHELLO_COL_SIZE = 8

/** 初期盤面 */
export const INIT_BOARD = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '○', '●', '', '', ''],
  ['', '', '', '●', '○', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
]

export const useWebSocketValueKey = [
  'a',
  'history',
  'myStoneColor',
  'notReverseHistory',
  'stepNumber',
  'blackIsNext',
  'reverseIndex',
  'player',
]
export const OTHELLO_VALUE = {
  a: '',
  blackIsNext: false,
  myStoneColor: null,
  blackStoneCount: 0,
  whiteStoneCount: 0,
  skipFlag: true,
  message: '',
  winner: '',
  player: null,
  squaresDom: null,
  stepNumber: 0,
  jumpFlag: false,
  notReverseHistory: {
    notReverseHistory: [
      {
        notReverseSquare: INIT_BOARD,
      },
    ],
  },
  reverseIndex: [],
  history: {
    history: [
      {
        square: INIT_BOARD,
      },
    ],
  },
}
