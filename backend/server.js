const Sequelize = require('sequelize');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'postgres'
});

const User = sequelize.import(__dirname + '/models/user');
// sequelize.sync({force: true});

const app = express();

passport.use(new LocalStrategy((username, pass, cb) => {
  console.log(`---- LocalStrategy (${username})----`);
  const hashedPass = bcrypt.hashSync(pass)
  User.findOne({
    where: {
      username: username
    }
  }).then(function (user, err) {
    console.log('user', user);
    if (err) {
      console.log('error', err);
      return cb(err);
    } else {
      if (user && bcrypt.compareSync(pass, user.password)) {
        console.log('password OK');
        return cb(null, user);
      } else {
        console.log('password NOK');
        return cb(null, false);
      }
    }
  })
}))

passport.serializeUser(function (user, cb) {
  console.log(`---- serializeUser (${user})----`);
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  console.log(`---- deserializeUser (${id})----`);
  User.findById(id).then(function (user) {
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

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.username;
  }
  next();
});


app.post(
  '/api/signup',
  upload.fields([]),
  (req, res, next) => {
    User.findOne({
      where: {
       username: req.body.username
      }
    }).then((user) => {
      if (user) {
        return user;
      } else {
        return User.create({
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
  function (req, res) {
    res.send(JSON.stringify({
      success: true,
      data: req.user.toJSON()
    }));
  }
);

app.get(
  '/api/checkAuth',
  function (req, res) {
    User.all()
    .then((users) => {
      console.log('------------ checkAuth -------------', req.isAuthenticated());
      res.send(JSON.stringify({
        success: true,
        data: {
          isAuthenticated: req.isAuthenticated(),
          user: req.user && req.user.toJSON()
        }
      }));
    });
  }
);

app.get('/api/users', function (req, res) {
  User.all()
  .then((users) => {
    res.send(JSON.stringify({
      success: true,
      data: users  // do not include pw!!!!
    }));
  });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
