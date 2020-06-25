# React Checkerboard

## Build

- Build with `npm run build`
- Run with `npm start`
- View at http://localhost:8001/

## Progress

Completed:
- Task 1
- Task 2
- Task 3

Plan for Task 4:

- Save button & maintaining game state:
    - Express:
        - Create a POST endpoint `/save` that receives the state variable `pieceLocations` as a JSON. Save it under `req.session['saved_game']` via the express-session middleware.
        - Create a GET endpoint `/load` that sends back `req.session['saved_game']` that was previously set with `/save`.
    - React:
        - On save button press, POST `/save` with the current `pieceLocations` value.
        - On page load/first render, GET `/load` and save as `pieceLocations` initial value.
- Reset button:
    - Express:
        - Create a POST endpoint `/reset` that triggers the server to clear `req.session['saved_game']`
    - React:
        - On reset button press, POST `/reset` and also reset the game board to the initial state on the front-end.
