const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    var user = await getUserByUsername(username)
    // console.log(user)
    if (user == null) {
      return done(null, false, { message: 'No user with that username' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("password correct")
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.username))
  passport.deserializeUser((username, done) => {
    return done(null, getUserByUsername(username))
  })
}

module.exports = initialize