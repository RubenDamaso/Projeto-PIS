const express = require('express');

const http = require('http');

const app = express();
const server = http.createServer(app);
const bodyParser =require("body-parser");
const requesthandler=require("./scripts/requestHandlers");

app.use(express.static("www",{
  "index":"index.html"
}));

app.engine('hbs', require('exphbs'));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded());

/*Endpoints*/
app.post("/Register",requesthandler.RegisterUser);
app.post("/Login",requesthandler.Login);




server.listen(8081, () => {
    console.log('Server running at http://localhost:8081');
  });