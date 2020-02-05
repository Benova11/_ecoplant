const http = require('http');
const app = require('./app');

const server = http.createServer(app);
server.on('error', () => {
  console.log('cant connect to server');
});
server.on('listening', () => {
  console.log('connected to server, app listening on port 3000');
});
server.listen(3000);
