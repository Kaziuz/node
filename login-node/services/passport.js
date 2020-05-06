const passport = require("passport")
// google strategy export some properties
// i take just strategy 
const googleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")
const keys = require("../config/keys");

const User = mongoose.model("users")

// save session user
passport.serializeUser((user, done) => {
  done(null, user.id);
})

// find user in data store for
// convert in user real
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
})

////////////////////
// auth the users //
////////////////////
passport.use(new googleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback', // google calback after user acept give data this app 
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log('access token', accessToken);
    // console.log('refresh token', refreshToken);
    // console.log('profile .!.', profile);

    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser)
    }
    // si ese perfil no existe en la base de datos
    // creamos ese usuario en la base de datos
    const user = await new User({ googleId: profile.id }).save()
    done(null, user)
  }
))

