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

app.post('/signup', function(req, res) {

  /* Look to see if user exists */
  _users.get('org.couchdb.user:' + req.body.username, function(err, body) {
    if (!err) { // user is present in the database, go directly to login authorization.
      // console.log('user \'' + req.body.username + '\' already exists. signing in user...') 
      login(req, res);
    } else if (err['message'] == 'missing' || err['status-code'] == 404) { // if the user isn't registered in the database, proceed with signup process
      // console.log('user ' + req.body.username + ' does not exist. creating user...');
      signup(req, res);
    } else { // there's a different error that's not meant to be handled
      console.error(err)
      res.send(500, err);
      return;  
    }
  });
  /* If no user with the same name exists */
});

app.get('/login', function(req, res) {
  res.type('html');
  res.end('<form method="post"><input type="username" name="user"></input> <br> <input type="password" name="password"></input><input type="submit"> </input>');
});

app.post('/login', login);

function login(req, res) {
  nano.auth(req.body.username, req.body.password, function(err, body, headers) {
    if (headers) { // authorization went through
      res.type('text/json');
      res.cookie("AuthSession", cookie.parse(headers['set-cookie'][0]).AuthSession);
      res.send({"user": req.body.username});
    }
    else // username/password combo got rejected
      res.send(403)
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
  nano.db.create(user.name, function(err, body) {
    if (!err) { // if nothing went wrong
      // console.log(user.name + "'s db was created.");
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
      var userDB = nano.use(user.name); // use the newly created database
      userDB.insert(security, "_security", function(err, body) { // add the '_security' doc to the db
        if (!err) {
          // console.log('\'_security\' document was successfully added to the database.');
          // insert user into the _users db
          _users.insert(user, 'org.couchdb.user:' + user.name, function(err, body) {
            if (!err) {
              // console.log('user ' + user.name + ' has been added. logging in...')
              // success! now login the freshly-minted user.
              login(req, res);
            } else {
              console.error(err)
              res.send(500, err);
              return;
            }
          }); 
        } else {
          console.error(err)
          res.send(500, err);
          return;
        }
      });
    } else {
      console.error(err)
      res.send(500, err);
      return;
    }
  });
}

var server = app.listen(3000, function() {
  console.info('Listening on port %d', server.address().port);
});

