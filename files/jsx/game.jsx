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

    var piece_color,
        piece_style;
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
    return (
        <td className="game_box">
            {piece_color ?
                <Piece
                    color={piece_color}
                    piece_char={piece_style} />
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

    function getPlayerNum(i) {
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
                playerNum={getPlayerNum(i)}
                playerOneStyle={props.playerOneStyle}
                playerTwoStyle={props.playerTwoStyle}
                playerOneColor={props.playerOneColor}
                playerTwoColor={props.playerTwoColor}
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
          [playerOneStyle, setPlayerOneStyle] = React.useState('P'),
          [playerTwoStyle, setPlayerTwoStyle] = React.useState('P'),
          [playerOneColor, setPlayerOneColor] = React.useState('red'),
          [playerTwoColor, setPlayerTwoColor] = React.useState('black'),
          /* Set form width to width of board */
          form_width = boardSize * 40; // 40px per box

    function restyle_board(e) {
        e.preventDefault();
        var size = e.target[0].value;
        if (size > 0) {
            setBoardSize(size);
        }
    }

    function PieceStyleOption(props) {

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
            player_style;
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

        return (
            <>
                <div className="my-1">
                    <label className="m-0">
                        Player {props.player_num} Piece Style:
                    </label>
                    <label htmlFor={`${name}_option1`} className="my-0">
                        <input id={`${name}_option1`}
                               type="radio"
                               name={name}
                               value="P"
                               className="mx-1"
                               onChange={handleStyleChange}
                               checked={player_style['char']=='P'}/>
                        P
                    </label>
                    <label htmlFor={`${name}_option2`} className="my-0">
                        <input id={`${name}_option2`}
                               type="radio"
                               name={name}
                               value="X"
                               onChange={handleStyleChange}
                               className="mx-1"
                               checked={player_style['char']=='X'}/>
                       X
                    </label>
                    <label htmlFor={`${name}_option3`} className="my-0">
                        <input id={`${name}_option3`}
                               type="radio"
                               name={name}
                               value="Y"
                               onChange={handleStyleChange}
                               className="mx-1"
                               checked={player_style['char']=='Y'}/>
                       Y
                   </label>
                </div>
                <div className="my-1">
                    <label className="m-0">
                        Player {props.player_num} Color:
                    </label>
                    <label htmlFor={`${name}_color1`} className="my-0">
                        <input id={`${name}_color1`}
                               type="radio"
                               name={name+'color'}
                               value="red"
                               className="mx-1"
                               onChange={handleColorChange}
                               checked={player_style['color']=='red'}/>
                        Red
                    </label>
                    <label htmlFor={`${name}_color2`} className="my-0">
                        <input id={`${name}_color2`}
                               type="radio"
                               name={name+'color'}
                               value="black"
                               onChange={handleColorChange}
                               className="mx-1"
                               checked={player_style['color']=='black'}/>
                       Black
                    </label>
                    <label htmlFor={`${name}_color3`} className="my-0">
                        <input id={`${name}_color3`}
                               type="radio"
                               name={name+'color'}
                               value="yellow"
                               onChange={handleColorChange}
                               className="mx-1"
                               checked={player_style['color']=='yellow'}/>
                       Yellow
                   </label>
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
                   playerTwoColor={playerTwoColor} />
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
                <input
                    id="input_size"
                    type="number"
                    min="1"
                    defaultValue="8"
                    className="form-control" />
                <div className="my-1 text-center">
                    <input
                        type="submit"
                        className="btn btn-primary btn-sm rounded-pill" />
                </div>
                <PieceStyleOption player_num="1" />
                <PieceStyleOption player_num="2" />
            </form>
        </div>
    );
}

ReactDOM.render(
    <Game />,
    document.getElementById('main')
);
