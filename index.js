// require your server and launch it
const port = 5000;
const server = require('./api/server');

const sayHello = () => {
    console.log(`server is listening on port: ${port}`);
}

server.listen(port, sayHello);