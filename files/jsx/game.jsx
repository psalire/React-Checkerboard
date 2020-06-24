import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

function Piece(props) {

    return (
        <div
          className="text-center"
          style={{'color': props.color}}>
            P
        </div>
    )
}

/* Individual space on board */
function Box(props) {

    return (
        <td className="game_box">
            {props.hasPiece ? <Piece color="red" /> : null}
        </td>
    );
}

/* Game board row */
function Row(props) {

    var row = [];
    for (let i = 0; i < props.boardSize; i++) {
        row.push(
            <Box hasPiece={props.hasPiece} />
        );
    }

    return (
        <tr>
            {row}
        </tr>
    );
}

/* Game board */
function Board(props) {

    /* Build board based on size */
    var rows = [];
    for (let i = 0; i < props.boardSize; i++) {
        rows.push(
            <Row
                boardSize={props.boardSize}
                hasPiece={i <= 1 || i >= 6}/>
        );
    }

    return (
        <table id="game_board" className="mx-auto">
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

function Game() {
    /* Allow user to resize board, default size 8x8 */
    const [boardSize, setBoardSize] = React.useState(8),
          /* Set form width to width of board */
          form_width = boardSize * 40; // 40px per box

    function resize_board(e) {
        e.preventDefault();
        var size = e.target[0].value;
        if (size > 0) {
            setBoardSize(size);
        }
    }

    return (
        <div>
            <Board boardSize={boardSize} />
            <form style={{'width': form_width}}
                  className="mx-auto"
                  onSubmit={resize_board}>
                <h3 className="text-center mt-1">Board Options:</h3>
                <div className="text-center">
                    <label htmlFor="input_size"
                        className="m-0">
                        Resize Board:
                    </label>
                </div>
                <input
                    id="input_size"
                    type="number"
                    min="1"
                    className="form-control" />
                <div className="my-1 text-center">
                <input
                    type="submit"
                    className="btn btn-primary btn-sm rounded-pill" />
                </div>
            </form>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('main')
);
