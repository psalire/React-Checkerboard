import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

/* Piece with color */
function Piece(props) {

    return (
        <div
          className="text-center font-weight-bold"
          style={{'color': props.color}}>
            {props.piece_char}
        </div>
    )
}

/* Individual space on board */
function Box(props) {

    var piece_color;
    switch(props.playerNum) {
        case 1: piece_color = "red"; break;
        case 2: piece_color = "black"; break;
        default: piece_color = null;
    }
    return (
        <td className="game_box">
            {piece_color ?
                <Piece
                    color={piece_color}
                    piece_char="P"/>
                : null
            }
        </td>
    );
}

/* Game board row */
function Row(props) {

    var row = [];
    for (let i = 0; i < props.boardSize; i++) {
        row.push(
            <Box playerNum={props.playerNum} />
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

    function getPlayerNum(i) {
        if (i <= 1) {
            return 1
        }
        else if (i >= 6) {
            return 2;
        }
        return null;
    }

    /* Build board based on size */
    var rows = [];
    for (let i = 0; i < props.boardSize; i++) {
        rows.push(
            <Row
                boardSize={props.boardSize}
                playerNum={getPlayerNum(i)}/>
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

    function PieceStyleOption(props) {

        var name = `player_${props.player_num}`;

        return (
            <div className="my-1">
                <label htmlFor="input_size"
                    className="m-0">
                    Player {props.player_num} Piece Style:
                </label>
                <label htmlFor={`${name}_option1`} className="my-0">
                    <input id={`${name}_option1`}
                           type="radio"
                           name={name}
                           value="1"
                           className="mx-1"
                           defaultChecked={true} />
                    1
                </label>
                <label htmlFor={`${name}_option2`} className="my-0">
                    <input id={`${name}_option2`}
                           type="radio"
                           name={name}
                           value="X"
                           className="mx-1"/>
                   X
                </label>
                <label htmlFor={`${name}_option3`} className="my-0">
                    <input id={`${name}_option3`}
                           type="radio"
                           name={name}
                           value="Y"
                           className="mx-1"/>
                   Y
               </label>
            </div>
        );
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
                <PieceStyleOption player_num="1" />
                <PieceStyleOption player_num="2" />
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
