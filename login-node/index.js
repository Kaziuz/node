const express = require("express")
const passport = require("passport")
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const bodyParser = require('body-parser')
const keys = require("./config/keys")

// mongo created a collection of users
require('./models/User');

// ejecuted strategies for login google
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json())

// le decimos a nuestra aplicacion
// que necesita hacer uso de cookies
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias habilitada la cookie
  keys: [keys.cookieKey] // seguridad para la cookie
}))

// le decimos a passport que debe 
// hacer uso de las cookies para manejar
// la autenticación
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
authRoutes(app);

const PORT = process.env.PORT || 5000

// test endPoint
app.get('/', async (req, res) => {
  res.send({ 'message': 'api runing!'})
})

app.listen(PORT)