const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

// Set up the Passport strategy:
passport.use(new LocalStrategy(
    async function(username, password, done) {
            const user = helper.findByUsername(username, async (err, user) => {
                console.log(`in passport.js's passport strategy now!`)
                console.log(`username is ${username}, and user is ${user}, and user.username is ${user.username}`)
                if(err) return done(err);
                console.log('no error')
                if (!user.username) return done(null, false);
                console.log('user exists!')
                try {
                    console.log('in the try section')
                    console.log(`password is ${password} and user.password is ${user.password}`);
                    const matchedPassword = await bcrypt.compare(password, user.password);
                    console.log(`matchedPassword is ${matchedPassword}`);
                    if(!matchedPassword) return done(null, false);
                    console.log('passed the matchedPassword test!')
                    return done(null, user);
                } catch(err) {
                    console.log(err);
                    return done(err);
                }
            });

    }
  ));

// Serialize a user
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Deserialize a user
passport.deserializeUser(async (id, done) => {
    helper.findById(id, (err, user) => {
       if (err) return done(err); 
       done(null, user);
    });
});