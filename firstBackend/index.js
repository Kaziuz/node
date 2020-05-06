var express = require('express') // importamos libreria
var app = express() // creamos instancia de una aplicacion express

var fs = require('fs') // file System para trabajar con archivos de la computadora
var _ = require('lodash')
var path = require('path')
var engines = require('consolidate')
var helpers = require('./helpers')

var bodyParser = require('body-parser')

var JSONStream = require('JSONStream')

// hace posible que podamos usar paquetes externos como handlerbars
app.engine('hbs', engines.handlebars)

// habilitamos template engines
app.set('views', './views') // default directory
//app.set('view engine', 'jade') // view engine
app.set('view engine', 'hbs') // view engine

// para servir archivos estaticos
//          prefijo                     directorio de imagenes
app.use('/profilepics', express.static('images'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/favicon.ico', function(req,res) {
    res.end()
})

app.get('/', function (req, res) {
    var users = []
    /*
    Asynchronous readdir(3). Reads the contents of a directory. The callback gets two arguments (err, files)
     where files is an array of the names of the files in the directory excluding '.' and '..'.
    */
    fs.readdir('users', function (err, files) {
        if (err) throw err
      files.forEach(function (file) {
          // Asynchronously reads the entire contents of a file.
        fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function (err, data) {
            if (err) throw err
          var user = JSON.parse(data)
          user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
          users.push(user)
          if (users.length === files.length) res.render('index', { users: users })
        })
      })
    })
  })

// creamos una ruta al home o root
/*
app.get('/', (req, res) => {
    //res.send('Hello, world!')
    //res.send(JSON.stringify(users, null, 2)) // servir simplemente el archivo
    res.render('index', { users: users } )
})
*/

// para poder descargar el json de un usuario
app.get('*.json', function (req, res) {
    res.download('./users/' + req.path, `virus.exe`)
})

// un route para ver el json de los usuarios
app.get('/data/:username', function (req, res) {
    var username = req.params.username
    // var user = helpers.getUser(username) // no borrar
    // res.json(user) // no borrar

    // usaremos los streams aqui
   var readable = fs.createReadStream('./users/' + username + '.json')
   readable.pipe(res)
})

app.get('/users/by/:gender', function (req, res) {
    var gender = req.params.gender
    var readable = fs.createReadStream('users.json')

    // esta opción es muy importante porque nos
    // permite crear respuestas personalizadas
    // a partir de un json existente
    readable
        .pipe(JSONStream.parse('*', function (user) {
            if (user.gender === gender) return user
        }))
        .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
        .pipe(res)
})

app.get('/error/:username', function(req, res) {
    res.status(404).send('No user named ' + req.params.username + ' no found')
})

var userRouter = require('./username')
app.use('/:username', userRouter)

var server = app.listen(3000, () => {
    console.log(`Server runing at http://localhost: ${server.address().port}`)
})