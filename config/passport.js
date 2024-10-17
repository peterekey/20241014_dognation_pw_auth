const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

// Set up the Passport strategy:
passport.use(new LocalStrategy(
    function(username, password, done) {
      helper.findByUsername(username, (err, user) => {
        
      })
    }
  ));

// Serialize a user

// Deserialize a user
