//ecoute des requetes http et réponse
//import du package http, https requiert un certificat SSL à obtenir avec un nom de domaine
const http = require('http');
//import de app
const app = require('./app');

//fonction de normalisation du port d'écoute
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//si aucun port fourni, ce sera 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


//recherche et gère les erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création d'un server express qui prend app en parametre
const server = http.createServer(app);

//gestion d'erreur
server.on('error', errorHandler);
//gestion de l'écoute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Now live : Listening on ' + bind);
});


//écoute au port définit
server.listen(port);

