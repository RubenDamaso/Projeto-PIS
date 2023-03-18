const express = require('express');
const mustacheExpress = require("mustache-express");
const app = express();
const session = require('express-session');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: '4E6F656C69610A',
  resave: false,
  saveUninitialized: true
}));


app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/public/Views");

const requesthandler=require("./scripts/requestHandlers");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


/*Endpoints*/
app.get("/", function (req, res) {
  if (req.session.user) {
    console.log(req.session.user.Name_User);
    res.render('dashboard',req.session.user);
   
  } else {
    res.render("index");
  }
});
app.post("/Register",requesthandler.RegisterUser);
app.post("/Login",requesthandler.Login);
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.Name_User);
    res.render('dashboard',req.session.user);
   
  } else {
    res.redirect('/');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(8081, () => {
    console.log('Server running at http://localhost:8081');
  });