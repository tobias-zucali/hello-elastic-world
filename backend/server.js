const Sequelize = require('sequelize');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'postgres'
});

const User = sequelize.import(__dirname + '/models/user');
// sequelize.sync({force: true});

const app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'hey ho cowboy!', resave: false, saveUninitialized: false }));

passport.use(new LocalStrategy((username, pass, cb) => {
  debugger;
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

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.username;
  }
  next();
});

app.post("/api/signup", upload.fields([]), (req, res, next) => {
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
});

// app.get('/api/checkAuth',
//   passport.authenticate('local'),
//   function(req, res) {
//     res.send(JSON.stringify({
//       success: true,
//       data: {
//         hey: 'ho',
//         user, user
//       }
//     }));
//   }
// );

app.post(
  '/api/login',
  function (req, res, next) {
    debugger;
    next();
  },
  passport.authenticate('local'),
  function (req, res) {
    User.all().then((users) => {
      res.send(JSON.stringify({
        success: true,
        data: users
      }));
    });
  }
);

app.get(
  '/api/checkAuth',
  function (req, res, next) {
    debugger;
    const authFunc = passport.authenticate('local');
    authFunc(req, res, (res) => {
      debugger;
      next();
    });
  },
  function (req, res) {
    User.all().then((users) => {
      res.send(JSON.stringify({
        success: true,
        data: users
      }));
    });
  }
);

app.get('/api/users', function (req, res) {
  User.all()
  .then((users) => {
    res.send(JSON.stringify({
      success: true,
      data: users
    }));
  });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
