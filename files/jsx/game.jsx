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
    );
}

/* Individual space on board */
function Box(props) {

    /* Check if row, col is occupied */
    function has_piece(loc) {
        for (let p of ['1', '2']) {
            if (props.pieceLocations[p] &&
                props.pieceLocations[p][loc[0]] &&
                props.pieceLocations[p][loc[0]][loc[1]] >= 0) {
                return true
            }
        }
        return false;
    }

    function select_piece() {
        /* Set row & col of selected piece */
        props.setSelectedPiece([props.rowNum, props.colNum]);
        /* Set suggested moves of selected piece */
        var locations = [],
            potential_moves = [];
        switch(props.pieceOwner) {
            case 1:
                potential_moves = [[props.rowNum+1, props.colNum+1], [props.rowNum+1, props.colNum-1]];
                break;
            case 2:
                potential_moves = [[props.rowNum-1, props.colNum+1], [props.rowNum-1, props.colNum-1]];
                break;
            default: potential_moves = null;
        }
        if (potential_moves) {
            for (let loc of potential_moves) {
                if (!has_piece(loc)) {
                    locations.push(loc);
                }
            }
            props.setSuggestedMoves(locations);
        }
        else {
            props.setSuggestedMoves(null)
        }
    }

    var piece_color, piece_style;
    /* Determine color and piece style */
    switch(props.pieceOwner) {
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
    var is_selected;
    if (props.selectedPiece) {
        is_selected = props.rowNum == props.selectedPiece[0] &&
                      props.colNum == props.selectedPiece[1];
    }
    /* Determine if self is a suggested move */
    var is_suggested;
    if (!is_selected && props.suggestedMoves) {
        for (let suggested of props.suggestedMoves) {
            if (props.rowNum == suggested[0] &&
                props.colNum == suggested[1]) {
                is_suggested = true;
                break;
            }
        }
    }

    return (
        <td className={"game_box m-0"+(
                is_selected ? " selected_border"
                : (is_suggested ? " suggested_border" : "")
            )}
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

    /* Determine if box has piece, and which player owns it */
    function get_owner(row, col) {
        if (props.pieceLocations['1'][row] &&
            props.pieceLocations['1'][row][col] >= 0) {
            return 1;
        }
        else if (props.pieceLocations['2'][row] &&
                 props.pieceLocations['2'][row][col] >= 0) {
            return 2;
        }
        return null;
    }

    var row = [];
    for (let i = 0; i < props.boardSize; i++) {
        row.push(
            <Box
                pieceOwner={get_owner(props.rowNum, i)}
                playerOneStyle={props.playerOneStyle}
                playerTwoStyle={props.playerTwoStyle}
                playerOneColor={props.playerOneColor}
                playerTwoColor={props.playerTwoColor}
                pieceLocations={props.pieceLocations}
                rowNum={props.rowNum}
                colNum={i}
                selectedPiece={props.selectedPiece}
                setSelectedPiece={props.setSelectedPiece}
                suggestedMoves={props.suggestedMoves}
                setSuggestedMoves={props.setSuggestedMoves}
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

    /* Build board based on size */
    var rows = [];
    for (let i = 0; i < props.boardSize; i++) {
        rows.push(
            <Row
                boardSize={props.boardSize}
                playerOneStyle={props.playerOneStyle}
                playerTwoStyle={props.playerTwoStyle}
                playerOneColor={props.playerOneColor}
                playerTwoColor={props.playerTwoColor}
                pieceLocations={props.pieceLocations}
                rowNum={i}
                selectedPiece={props.selectedPiece}
                setSelectedPiece={props.setSelectedPiece}
                suggestedMoves={props.suggestedMoves}
                setSuggestedMoves={props.setSuggestedMoves}
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
          /* Start with 8x8 board and set pieces in correct places */
          [pieceLocations, setPieceLocations] = React.useState({
              '1': {
                  0: [0,1,2,3,4,5,6,7],
                  1: [0,1,2,3,4,5,6,7]
              },
              '2': {
                  6: [0,1,2,3,4,5,6,7],
                  7: [0,1,2,3,4,5,6,7]
              }
          }),
          /* Set form width to width of board */
          form_width = boardSize * 40; // 40px per box

    function restyle_board(e) {
        e.preventDefault();
        var size = e.target[0].value;
        if (size > 0) {
            setBoardSize(size);
            /* Update pieces */
            let end_rows = [String(size-2), String(size-1)];
            let pieces = {
                '1':{
                    '0': [],
                    '1': []
                },
                '2': {
                    [end_rows[0]]: [],
                    [end_rows[1]]: []
                }
            };
            for (let i = 0; i < size; i++) {
                pieces['1']['0'].push(i);
                pieces['1']['1'].push(i);
                pieces['2'][end_rows[0]].push(i);
                pieces['2'][end_rows[1]].push(i);
            }
            setPieceLocations(pieces);
        }
    }

    /* Radio form for styling pieces */
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

        /* Determine styling */
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
        for (let color of ['red', 'black', 'green']) {
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
                   setSuggestedMoves={setSuggestedMoves}
                   pieceLocations={pieceLocations}
                   setPieceLocations={setPieceLocations} />

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
