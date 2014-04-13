var express = require("express"),
    app = express(),
    cookie = require('cookie'),
    nano = require('nano')('http://davis:dbh10128@localhost:5984'),
    _users = nano.use('_users');

app.configure(function() {  
  app.engine("html", require("ejs").renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  
  app.use(express.logger('dev'));
  
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  
  app.use(express.session({ secret: 'keyboard cat' }));
  
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));

});

app.get('/', function(req, res) {
  res.send("Hello, World!");
});

app.get('/planner', function(req, res) {
  res.render("index.html");
});

app.get('/signup', function(req, res) {
  var user = {
    name: 'john',
    password: 'secret',
    roles: [],
    type: 'user'
  };
  _users.insert(user, 'org.couchdb.user:john', function(err, body) {
    if (err) console.log(err);
    console.log(body);
    res.end("bye");
  });
});

app.get('/login', function(req, res) {
  res.type('html');
  res.end('<form method="post"><input type="username" name="user"></input> <br> <input type="password" name="password"></input><input type="submit"> </input>');
});

app.post('/login', function(req, res) {
  nano.auth(req.body.username, req.body.password, function(err, body, headers) {
    if (headers) {
      res.type('text/json');
      res.cookie("AuthSession", cookie.parse(headers['set-cookie'][0]).AuthSession);
      res.send({"user": req.body.username, "cookie": cookie.parse(headers['set-cookie'][0])});
    }
    else
      res.send(403)
  });
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

