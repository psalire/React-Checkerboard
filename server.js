const express = require('express'),
      app = express(),
      session = require('express-session'),
      mongo_store = require('connect-mongo')(session),
      csrf = require('csurf'),
      ejs = require('ejs'),
      mongoose = require('mongoose'),
      PORT = 8001;

/******** Configure MongoDB ********/
mongoose.connect('mongodb://127.0.0.1:27017/boardgame', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

/******** Configure Server ********/
const Game = express.Router();
app.use(session({
    secret: 'your_secret',
    store: new mongo_store({mongooseConnection: db}),
    cookie: {
        sameSite: true
    }
}));
app.use(csrf());
app.use(express.json());
app.engine('html', ejs.renderFile);
app.set('views', __dirname+'/files/views');
app.use('/js', express.static('files/js'));
app.use('/Game', Game);

/******** Set Server Routes ********/
/* Main page */
app.get('/', (req, res) => {
    res.render('index.ejs.html', {csrf_token: req.csrfToken()});
});
/* Game endpoints */


var server = app.listen(PORT, () => {
    var host = server.address();
    console.log('Server running on %s:%s', host.address, host.port);
});
