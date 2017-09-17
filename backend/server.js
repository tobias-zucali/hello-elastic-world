const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const models = require('./models');

const app = express();

passport.use(new LocalStrategy((username, pass, cb) => {
  console.log(`---- LocalStrategy (${username})----`);
  const hashedPass = bcrypt.hashSync(pass)
  models.User.findOne({
    where: {
      username: username
    }
  }).then((user, err) => {
    if (err) {
      return cb(err);
    } else {
      if (user && bcrypt.compareSync(pass, user.password)) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    }
  })
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  models.User.findById(id).then((user) => {
    cb(null, user);
  });
});


const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(session({ secret: 'my secret secret' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user.username;
  }
  next();
});


app.post(
  '/api/signup',
  upload.fields([]),
  (req, res, next) => {
    models.User.findOne({
      where: {
       username: req.body.username
      }
    }).then((user) => {
      if (user) {
        return user;
      } else {
        return models.User.create({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password)
        });
      }
    }).then((user) => {
      req.login(user, function(err) {
        if (err) {
          return Promise.reject(err);
        } else {
          next();
        }
      });
    }).catch((error) => {
      res.send(JSON.stringify({
        success: false,
        data: error
      }));
    });
  },
  passport.authenticate('local'),
  (req, res) => {
    res.send(JSON.stringify({
      success: true,
      data: 'hey ho!'
    }));
  }
);

app.post(
  '/api/login',
  upload.fields([]),
  passport.authenticate('local'),
  (req, res) => {
    res.send(JSON.stringify({
      success: true,
      data: req.user.toFrontend()
    }));
  }
);

app.get(
  '/api/checkAuth',
  (req, res) => {
    models.User.all()
    .then((users) => {
      res.send(JSON.stringify({
        success: true,
        data: {
          isAuthenticated: req.isAuthenticated(),
          user: req.user && req.user.toFrontend()
        }
      }));
    });
  }
);

app.get('/api/users', (req, res) => {
  models.User.all()
  .then((users) => {
    res.send(JSON.stringify({
      success: true,
      data: users  // do not include pw!!!!
    }));
  });
});

app.listen(3001, function () {
  console.log('Server listening on port 3001!');
});
