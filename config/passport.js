const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

// Set up the Passport strategy:
passport.use(new LocalStrategy(
    function(username, password, done) {
      helper.findByUsername(username, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);
        if(user.password != password) return done(null, false);
        return done(null, user);
      })
    }
  ));

// Serialize a user
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Deserialize a user
passport.deserializeUser((user, done) => {
    helper.findById(user.id, (err, user) => {
       if (err) return done(err); 
    });
})