var express = require("express"),
    app = express(),
    cookie = require('cookie'),
    // nano = require('nano')('http://server:password@localhost:5984'),
    nano = require('nano')('http://server:password@davish.iriscouch.com'),
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
  res.redirect("/planner");
});

app.get('/planner', function(req, res) {
  res.render("index.html");
});

app.get('/settings', function(req, res) {
    res.redirect('/planner');
});

app.post('/signup', function(req, res) {
  /* Look to see if user exists */
  _users.get('org.couchdb.user:' + req.body.username, function(err, body) {
    if (!err) { // user is present in the database
      res.send(403, {'message': 'The username you attempted to sign up with already exists.'});
    } else if (err['message'] == 'missing' || err['status-code'] == 404) { // if the user isn't registered in the database, proceed with signup process
      signup(req, res);
    } else { // there's a different error that's not meant to be handled
      console.error(err)
      res.send(500, err);
      return;  
    }
  });
});

app.post('/login', login);

app.get('/logout', function(req, res) {
  req.session.username = undefined;
  req.session.password = undefined;
  res.clearCookie("AuthSession");
  res.redirect('/planner');
});

app.get('/session', function(req, res) {
  res.send({
    "username": req.session.username,
    "password": req.session.password
  });
});

function login(req, res) {
  nano.auth(req.body.username, req.body.password, function(err, body, headers) {
    if (headers) { // authorization went through
      req.session.username = req.body.username;
      req.session.password = req.body.password;

      res.type('text/json');
      res.cookie("AuthSession", cookie.parse(headers['set-cookie'][0]).AuthSession);
      res.send({"user": req.body.username});
    }
    else // username/password combo got rejected
      res.send(403, {'message': 'The username and password entered do not match.'});
  });
}

function signup(req, res) {
  // create the user schema
  var user = {
    name: req.body.username,
    password: req.body.password,
    roles: [],
    type: 'user'
  };
  // create the companion db and add the _security doc to it with said user as the sole member.
  // http://wiki.apache.org/couchdb/Security_Features_Overview
  nano.db.create(user.name, function(err, body) { // mo' callbacks mo' problems
    if (!err) { // if nothing went wrong
      var security = {
        'admins': {
          'names': [],
          'roles': []
        },
        'members': {
          'names': [user.name], // only person with read or write access should be the user we're about to create
          'roles': []
        }
      }
      var settings = {
        'rows': [
                  "English", 
                  "History", 
                  "Math", 
                  "Science", 
                  "Language",
                  "Other"
                ],
        'theme': "default"
      }
      var userDB = nano.use(user.name); // use the newly created database
      userDB.insert(security, "_security", function(err, body) { // add the '_security' doc to the db
        if (!err) {
          userDB.insert(settings, "settings", function(err, body) {
            // insert user into the _users db
            if (!err) {
              _users.insert(user, 'org.couchdb.user:' + user.name, function(err, body) {
                if (!err) {
                  // success! now login the freshly-minted user.
                  login(req, res);
                } else {
                  console.error(err);
                  res.send(500, err);
                  return;
                }
              }); 
            } else {
              console.error(err);
              res.send(500, err);
              return;
            }
          });
        } else {
          console.error(err);
          res.send(500, err);
          return;
        }
      });
    } else {
      console.error(err);
      res.send(500, err);
      return;
    }
  });
}

var server = app.listen(process.argv[2] || 3000, function() {
  console.info('Listening on port %d', server.address().port);
});

