
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const configDB = require('./config/database.js');

const port = process.env.PORT || 5050;

// middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// connecting to my database
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.error(err));

// requiring the passport
require('./config/passport')(passport);

app.use(session({
  secret: 'simpleNotesSecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// requirin routes
const db = mongoose.connection;
require('./app/routes.js')(app, passport, db);

// running on the server
app.listen(port, () => {
  console.log(`🟢 Server running on port ${port}`);
});
