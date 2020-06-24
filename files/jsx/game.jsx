import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

/* Piece with color */
function Piece(props) {

    return (
        <div
          className="text-center font-weight-bold"
          style={{'color': props.color}}>
            {props.pieceChar}
        </div>
    )
}

/* Individual space on board */
function Box(props) {

    /* Set row & col of selected piece */
    function select_piece() {
        props.setSelectedPiece([props.rowNum, props.colNum])
    }

    var piece_color,
        piece_style,
        is_selected;
    /* Determine color and piece style */
    switch(props.playerNum) {
        case 1:
            piece_color = props.playerOneColor;
            piece_style = props.playerOneStyle;
            break;
        case 2:
            piece_color = props.playerTwoColor;
            piece_style = props.playerTwoStyle;
            break;
        default: piece_color = null;
    }
    /* Determine if self is selected */
    if (props.selectedPiece) {
        is_selected = props.rowNum == props.selectedPiece[0] &&
                      props.colNum == props.selectedPiece[1];
    }

    return (
        <td className={"game_box m-0"+(is_selected? " highlight_border":"")}
            onClick={select_piece} >
            {piece_color ?
                <Piece
                    color={piece_color}
                    pieceChar={piece_style}/>
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
            <Box
                playerNum={props.playerNum}
                playerOneStyle={props.playerOneStyle}
                playerTwoStyle={props.playerTwoStyle}
                playerOneColor={props.playerOneColor}
                playerTwoColor={props.playerTwoColor}
                rowNum={props.rowNum}
                colNum={i}
                selectedPiece={props.selectedPiece}
                setSelectedPiece={props.setSelectedPiece}
                key={'b'+i} />
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

    function get_player_num(i) {
        if (i <= 1) {
            return 1
        }
        else if (i >= props.boardSize - 2) {
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
                playerNum={get_player_num(i)}
                playerOneStyle={props.playerOneStyle}
                playerTwoStyle={props.playerTwoStyle}
                playerOneColor={props.playerOneColor}
                playerTwoColor={props.playerTwoColor}
                rowNum={i}
                selectedPiece={props.selectedPiece}
                setSelectedPiece={props.setSelectedPiece}
                key={'r'+i}/>
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
          [playerOneStyle, setPlayerOneStyle] = React.useState('O'),
          [playerTwoStyle, setPlayerTwoStyle] = React.useState('O'),
          [playerOneColor, setPlayerOneColor] = React.useState('red'),
          [playerTwoColor, setPlayerTwoColor] = React.useState('black'),
          [selectedPiece, setSelectedPiece] = React.useState(null),
          [suggestedMoves, setSuggestedMoves] = React.useState(null),
          /* Set form width to width of board */
          form_width = boardSize * 40; // 40px per box

    function restyle_board(e) {
        e.preventDefault();
        var size = e.target[0].value;
        if (size > 0) {
            setBoardSize(size);
        }
    }

    function PieceStyleRadios(props) {

        function handleStyleChange(e) {
            switch(props.player_num) {
                case "1": setPlayerOneStyle(e.target.value); break;
                case "2": setPlayerTwoStyle(e.target.value); break;
            }
        }
        function handleColorChange(e) {
            switch(props.player_num) {
                case "1": setPlayerOneColor(e.target.value); break;
                case "2": setPlayerTwoColor(e.target.value); break;
            }
        }

        var name = `player_${props.player_num}`,
            player_style,
            piece_options = [],
            color_options = [];
        switch(props.player_num) {
            case "1":
                player_style = {
                    'char': playerOneStyle,
                    'color': playerOneColor
                };
                break;
            case "2":
                player_style = {
                    'char': playerTwoStyle,
                    'color': playerTwoColor
                };
                break;
        }
        /* Piece options */
        for (let piece of ['O', 'X', 'Y']) {
            piece_options.push(
                <label htmlFor={`${name}_option${piece}`} className="my-0" key={piece}>
                    <input id={`${name}_option${piece}`}
                           type="radio"
                           name={name}
                           value={piece}
                           className="mx-1"
                           onChange={handleStyleChange}
                           checked={player_style['char']==piece}/>
                    {piece}
                </label>
            );
        }
        /* Color options */
        for (let color of ['red', 'black', 'yellow']) {
            color_options.push(
                <label htmlFor={`${name}_color${color}`} className="my-0" key={color}>
                    <input id={`${name}_color${color}`}
                           type="radio"
                           name={name+'color'}
                           value={color}
                           className="mx-1"
                           onChange={handleColorChange}
                           checked={player_style['color']==color}/>
                    {color}
                </label>
            );
        }

        return (
            <>
                <div className="my-1">
                    <label className="m-0">
                        Player {props.player_num} Piece Style:
                    </label>
                    {piece_options}
                </div>
                <div className="my-1">
                    <label className="m-0">
                        Player {props.player_num} Color:
                    </label>
                    {color_options}
                </div>
            </>
        );
    }

    return (
        <div>
            <Board boardSize={boardSize}
                   playerOneStyle={playerOneStyle}
                   playerTwoStyle={playerTwoStyle}
                   playerOneColor={playerOneColor}
                   playerTwoColor={playerTwoColor}
                   selectedPiece={selectedPiece}
                   setSelectedPiece={setSelectedPiece}
                   suggestedMoves={suggestedMoves}
                   setSuggestedMoves={setSuggestedMoves} />

            <form style={{'width': form_width}}
                  className="mx-auto"
                  onSubmit={restyle_board}>
                <h3 className="text-center mt-1">Board Options:</h3>
                <div className="text-center">
                    <label htmlFor="input_size"
                        className="m-0">
                        Resize Board:
                    </label>
                </div>
                <input id="input_size"
                       type="number"
                       min="1"
                       defaultValue="8"
                       className="form-control" />
                <div className="my-1 text-center">
                    <input
                        type="submit"
                        className="btn btn-primary btn-sm rounded-pill" />
                </div>
                <PieceStyleRadios player_num="1" />
                <PieceStyleRadios player_num="2" />
            </form>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('main')
);
