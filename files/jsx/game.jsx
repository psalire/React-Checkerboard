import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

const BOARD_SIZE = 8; // 8x8

/* Individual space on board */
function Box(props) {

    return (
        <td className="game_box"></td>
    );
}

/* Game board row */
function Row(props) {

    var row = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
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
    for (let i = 0; i < BOARD_SIZE; i++) {
        rows.push(<Row />);
    }

    return (
        <table id="game_board" className="mx-auto">
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

ReactDOM.render(
    <Board />,
    document.getElementById('main')
);
