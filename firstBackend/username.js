var express = require('express') // importamos libreria
var helpers = require('./helpers')
var fs = require('fs') // file System para trabajar con archivos de la computadora

var router = express.Router({
    mergeParams: true
})

// manejador de controlador de todos los verbos http para /:username
router.use(function (req, res, next) {
    console.log(req.method, 'for', req.params.username, ' at ' + req.path)
    next()
})

// los : significan una variable de ruta para express
router.get('/', (req, res) => {
    var username = req.params.username
    var user = helpers.getUser(username)
    res.render('user', { 
        user: user,
        address: user.location 
    })
})

// event handling error, middleware for handling errors
router.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something broke')
})

router.get('/edit', function (req, res) {
    res.send('You want to edit ' + req.params.username + '???')
})

// para actualizar el nombre
router.put('/', function (req, res) {
    var username = req.params.username
    var user = helpers.getUser(username)
    user.location = req.body
    helpers.saveUser(username, user)
    res.end()
})

// para borrar ese usuario
router.delete('/', function(req, res) {
    var fp = getUserFilePath(req.params.username)
    fs.unlinkSync(fp) // delete this file
    res.sendStatus(200)
})

module.exports = router