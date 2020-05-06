const express = require('express')
const bodyParser = require('body-parser')
//const cors = require

const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - aplicaction/json
app.use(bodyParser.json())

/////////////////////////////////////////
// configuring the database
/////////////////////////////////////////
const dbConfig = require('./config/database.config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false)

// connecting for the databse
mongoose.connect(dbConfig.url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false 
}).then(() => { console.log("Successfully connected to the database") }
).catch(err => {
  console.log("no se pude conectar", err)
  process.exit();
})

// test route
app.get('/', (req, res) => {
  res.json({ "message": "Welcome to test endPoint app" })
})

// require notes routes
// require('./app/routes/note.routes.js')(app)

const routes = require('./app/routes/note.routes.js')
routes(app)

app.listen(3000, () => {
  console.log(`server listen in port ${3000}`)
})