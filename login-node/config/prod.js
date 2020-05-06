// keys for dev production
// prod.js don't commit this

// this content for keys get of the heroku
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  //stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  //stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
