import PropTypes from 'prop-types'
import Board from '../board/Board'

export default Board.propTypes = {
  props: {
    count: PropTypes.int,
    reverseIndex: PropTypes.int,
    flag: PropTypes.bool,
    onClick: PropTypes.func,
    blackIsNext: PropTypes.bool,
  },
}
