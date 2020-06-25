import React from 'react';
import ReactDOM from 'react-dom';

export function StyleForm(props) {

    function restyle_board(e) {
        e.preventDefault();
        var size = e.target[0].value;
        if (size > 0) {
            props.setBoardSize(size);
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
            props.setPieceLocations(pieces);
            props.setTurn('1');
        }
    }

    /* Radio form for styling pieces */
    function radio_style_form(player_num) {
        function handleStyleChange(e) {
            props.setPlayerStyles({
                ...playerStyles,
                [player_num]: e.target.value
            });
        }
        function handleColorChange(e) {
            props.setPlayerColors({
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
                radio_input(piece, 'piece', name, props.playerStyles[player_num], handleStyleChange)
            );
        }
        /* Color options */
        for (let color of ['Red', 'Black', 'Green']) {
            color_options.push(
                radio_input(color, 'color', name, props.playerColors[player_num], handleColorChange)
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
        <form style={{'width': props.formWidth}}
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
                    <tr>
                        <th colSpan="2" className="text-center">Style Options:</th>
                    </tr>
                </thead>
                <tbody>
                    {radio_style_form("1")}
                    {radio_style_form("2")}
                </tbody>
            </table>
        </form>
    );
}
