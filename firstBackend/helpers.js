var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function getUser (username) {
  // readFileSync Returns the contents of the path.
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
  // convertimos los keys de un objeto en array
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key])
  })
  return user
}

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json'
}

function saveUser (username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file Synchronous
  // Escribe de forma síncrona los datos en un archivo, reemplazando 
  // el archivo si ya existe. Los datos pueden ser una cadena o un búfer. 
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}

function verifyUser (req, res, next) {
  var fp = getUserFilePath(req.params.username)

  fs.exists(fp, function (yes) {
      if(yes) {
          next()
      } else {
        // next('route')
        res.redirect('/error/' + req.params.username)
      }
  })
}

exports.getUser = getUser;
exports.getUserFilePath = getUserFilePath;
exports.saveUser = saveUser;
exports.verifyUser = verifyUser;
