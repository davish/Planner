var express = require("express"),
    app = express(),
    planner = require('./routes/planner'),
    mongoose = require('mongoose');


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

  mongoose.connect('mongodb://localhost/test');
});

app.get('/', function(req, res) {
  res.send("Hello, World!");
});

app.get('/planner', function(req, res) {
  res.render("index.html");
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

