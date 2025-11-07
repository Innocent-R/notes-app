const Note = require('./models/note');

module.exports = function (app, passport, db) {

  // Home page
  app.get('/', (req, res) => res.render('index.ejs', { message: req.flash('loginMessage') }));

  // login
  app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // sign up
  app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // profile for the user
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.render('profile.ejs', { user: req.user, notes });
    } catch (err) {
      console.error(err);
      res.render('profile.ejs', { user: req.user, notes: [] });
    }
  });

  // Adding a new note
  app.post('/addNote', isLoggedIn, async (req, res) => {
    try {
      await Note.create({
        userId: req.user._id,
        title: req.body.title,
        content: req.body.content
      });
      res.redirect('/profile');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // deleting a note
  app.delete('/deleteNote', isLoggedIn, async (req, res) => {
    try {
      await Note.findOneAndDelete({ _id: req.body.id, userId: req.user._id });
      res.send('Note deleted');
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // log the page out
  app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  // middleware
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }
};
