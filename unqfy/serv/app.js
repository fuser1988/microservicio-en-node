const express = require("express"); 
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // soporte para bodies codificados en jsonsupport
app.use(bodyParser.urlencoded({ extended: true })); // soporte para bodies codificados


// Retorna una instancia de UNQfy. copy paste de main.js
const unqmod = require('../unqfy');
const fs = require('fs');

function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}


const filename = "../estado.json"
// 
const apiRest = require("./rest");
apiRest.Rest.register(app, filename, getUNQfy);

// port
const port = process.env.PORT || 5000;
app.listen(port,console.log('Magic happens on port ' + port));
