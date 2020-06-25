import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/bs.scss';

/* Piece with color */
function Piece(props) {

    return (
        <div
          className="text-center font-weight-bold piece"
          style={{'color': props.color}}>
            {props.pieceChar}
        </div>
    );
}

/* Individual space on board */
function Box(props) {

    /* Check if row, col is occupied */
    function has_piece(loc) {
        for (let p in props.pieceLocations) {
            if (props.pieceLocations[p] &&
                props.pieceLocations[p][loc[0]] &&
                props.pieceLocations[p][loc[0]].includes(loc[1])) {
                return true
            }
        }
        return false;
    }
    function handleBoardClick(origin, is_selected, is_suggested) {
        if (is_selected) {
            return;
        }
        if (is_suggested) {
            /* Find player that owns this piece */
            for (let p in props.pieceLocations) {
                for (let row in props.pieceLocations[p]) {
                    for (let col of props.pieceLocations[p][row]) {
                        if (row == origin[0] && col == origin[1]) {
                            /* Move piece from origin to destination */
                            var origin_row = props.pieceLocations[p][row];
                            origin_row.splice(origin_row.indexOf(origin[1]), 1);
                            var dest_row = props.pieceLocations[p][props.rowNum] || [];
                            dest_row.push(props.colNum);
                            props.setPieceLocations({
                                ...props.pieceLocations,
                                [p]: {
                                    ...props.pieceLocations[p],
                                    [props.rowNum]: dest_row
                                }
                            });
                            props.setSuggestedMoves(null);
                            props.setSelectedPiece(null);
                            return;
                        }
                    }
                }
            }
        }

        /* Set row & col of selected piece */
        props.setSelectedPiece([props.rowNum, props.colNum]);
        /* Set suggested moves of selected piece */
        var locations = [],
            potential_moves;
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
            props.setSuggestedMoves({
                origin: [props.rowNum, props.colNum],
                dest: locations
            });
        }
        else {
            props.setSuggestedMoves(null);
        }
    }

    /* Determine color and piece style */
    var piece_color = props.playerColors[props.pieceOwner],
        piece_style = props.playerStyles[props.pieceOwner];
    /* Determine if self is selected */
    var is_selected;
    if (props.selectedPiece) {
        is_selected = props.rowNum == props.selectedPiece[0] &&
                      props.colNum == props.selectedPiece[1];
    }
    /* Determine if self is a suggested move */
    var is_suggested, origin;
    if (!is_selected && props.suggestedMoves) {
        for (let suggested of props.suggestedMoves['dest']) {
            if (props.rowNum == suggested[0] &&
                props.colNum == suggested[1]) {
                is_suggested = true;
                origin = props.suggestedMoves['origin'];
                break;
            }
        }
    }

    return (
        <td className={"game_box m-0"+(
                is_selected ? " selected_border"
                : (is_suggested ? " suggested_border" : "")
            )}
            onClick={()=>{handleBoardClick(origin, is_selected, is_suggested)}} >
            {piece_color ?
                <Piece
                    color={piece_color}
                    pieceChar={piece_style} />
                : null
            }
        </td>
    );
}

/* Game board */
function Board(props) {

    function board_row(row_num) {
        /* Determine if box has piece, and which player owns it */
        function get_owner(row, col) {
            if (props.pieceLocations['1'][row] &&
                props.pieceLocations['1'][row].includes(col)) {
                return 1;
            }
            else if (props.pieceLocations['2'][row] &&
                     props.pieceLocations['2'][row].includes(col)) {
                return 2;
            }
            return null;
        }

        var row = [];
        for (let i = 0; i < props.boardSize; i++) {
            row.push(
                <Box
                    pieceOwner={get_owner(row_num, i)}
                    playerStyles={props.playerStyles}
                    playerColors={props.playerColors}
                    pieceLocations={props.pieceLocations}
                    rowNum={row_num}
                    colNum={i}
                    selectedPiece={props.selectedPiece}
                    setSelectedPiece={props.setSelectedPiece}
                    suggestedMoves={props.suggestedMoves}
                    setSuggestedMoves={props.setSuggestedMoves}
                    setPieceLocations={props.setPieceLocations}
                    key={'b'+i} />
            );
        }

        return <tr>{row}</tr>;
    }

    /* Build board based on size */
    var rows = [];
    for (let i = 0; i < props.boardSize; i++) {
        rows.push(board_row(i));
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
          [playerStyles, setPlayerStyles] = React.useState({'1': 'O', '2': 'O'}),
          [playerColors, setPlayerColors] = React.useState({'1': 'red', '2': 'black'}),
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
    function radio_style_form(player_num) {
        function handleStyleChange(e) {
            setPlayerStyles({
                ...playerStyles,
                [player_num]: e.target.value
            });
        }
        function handleColorChange(e) {
            setPlayerColors({
                ...playerColors,
                [player_num]: e.target.value
            });
        }
        /* Radio button input */
        function radio_input(term, type, name, curr_active, fun) {
            return (
                <label htmlFor={`${name}_${term}`} className="my-0" key={term}>
                    <input id={`${name}_${term}`}
                           type="radio"
                           name={`${name}_${type}`}
                           value={term}
                           className="mx-1"
                           onChange={fun}
                           checked={curr_active==term}/>
                    {term}
                </label>
            )
        }

        /* Determine styling */
        var name = `player_${player_num}`,
            piece_options = [],
            color_options = [];
        /* Piece options */
        for (let piece of ['O', 'X', 'Y']) {
            piece_options.push(
                radio_input(piece, 'piece', name, playerStyles[player_num], handleStyleChange)
            );
        }
        /* Color options */
        for (let color of ['Red', 'Black', 'Green']) {
            color_options.push(
                radio_input(color, 'color', name, playerColors[player_num], handleColorChange)
            );
        }

        return (
            <React.Fragment>
                <tr>
                    <td>
                        <label className="m-0">
                            Player {player_num} Piece Style:
                        </label>
                    </td>
                    <td className="d-flex justify-content-between">
                        {piece_options}
                    </td>
                </tr>
                <tr>
                    <td>
                        <label className="m-0">
                            Player {player_num} Color:
                        </label>
                    </td>
                    <td className="d-flex justify-content-between">
                        {color_options}
                    </td>
                </tr>
            </React.Fragment>
        );
    }

    return (
        <div>
            <Board boardSize={boardSize}
                   playerStyles={playerStyles}
                   playerColors={playerColors}
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
                <table>
                    <thead>
                        <tr><th colSpan="2" className="text-center">Style Options:</th></tr>
                    </thead>
                    <tbody>
                        {radio_style_form("1")}
                        {radio_style_form("2")}
                    </tbody>
                </table>
            </form>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('main')
);
