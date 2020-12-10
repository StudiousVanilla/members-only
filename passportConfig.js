const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const User = require('./models/usersModel')

passport.use( new LocalStrategy({usernameField: 'email'},
    (username, password, done) => {
        // checks User database for username matches
        User.findOne({username: username}, (err, user) => {
          if(err){
          return done(err);
          }
          // if there is no usernqme found in db
          if(!user){
              return done(null, false, { msg: 'Incorrect username'});
          } 

          // check password
          bcrypt.compare(password, user.password, (err, match) => {
              if(err){
                return done(err);
              }
              if(!match){
                return done(null, false, { msg: 'Incorrect password'});
              } 
              return done(null, user);
          })
      })
    }
))

// creates a cookie
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// disables the cookie
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




module.exports = passport