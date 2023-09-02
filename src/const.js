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
  'boardHistory',
  'myStoneColor',
  'notReversedBoardHistory',
  'stepNumber',
  'blackIsNext',
  'reverseIndex',
  'player',
  'isGameStart',
]
export const OTHELLO_VALUE = {
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
  notReversedBoardHistory: {
    body: [
      {
        notReversedBoardInfo: INIT_BOARD,
      },
    ],
  },
  reverseIndex: [],
  boardHistory: {
    body: [
      {
        boardInfo: INIT_BOARD,
      },
    ],
  },
  isGameStart: false,
}
