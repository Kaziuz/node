
// este archivo simplemente es una muestra de como se usa
// .creatReadStream, .createWriteStream, and .pipe
// pipe se encarga de canalizar los archivos de entrada hacia la salida

var fs = require('fs')

var inputFile = './users.json' // archivo de entrada
var outputFile = './out.json' // archivo de salida

var readable = fs.createReadStream(inputFile)
var writeable = fs.createWriteStream(outputFile)

readable.pipe(writeable)
