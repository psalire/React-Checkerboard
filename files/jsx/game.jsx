import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

/* Individual space on board */
function Box(props) {

    return (
        <td className="game_box"></td>
    );
}

/* Game board row */
function Row(props) {

    var row = [];
    for (let i = 0; i < props.boardSize; i++) {
        row.push(<Box />);
    }

    return (
        <tr>
            {row}
        </tr>
    );
}

/* Game board */
function Board(props) {

    var rows = [];
    for (let i = 0; i < props.boardSize; i++) {
        rows.push(<Row boardSize={props.boardSize}/>);
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
            <form style={{'width': form_width}}
                  className="mx-auto"
                  onSubmit={resize_board}>
                <label htmlFor="input_size"
                       className="m-0">
                    Resize Board:
                </label>
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
            <Board boardSize={boardSize} />
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('main')
);
