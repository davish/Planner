var ref = {
  'monday': getMonday(new Date())
  // 'rows': [["English", 1], ["World History", 2], ["Albgebra", 3], ["Biology", 7], ["Spanish", 4], ["Computer Science", 5], ["Labs", 6]],
};

var server = 'hermes.local';

var db = null;
var remoteCouch = false;
$('document').ready(function() {
  $.ajax({
    url: "/session",
    success: function(data) {
      if (data.username && data.password) {
        ref.user = data.username;
        login(data.username, data.password, function(data) { // Login was successful
          $('li#username').children('a').text(data.user);
          $('.loggedIn').show();
          $('.loggedOut').hide();
          $('textarea').each(function(index, attribute) {
            $(this).removeAttr("disabled");
          });
        }, function() { // login not successful
          $('.choiceModal').modal({backdrop: 'static', 'keyboard': false});
          $('li#username').children('a').text('');
          $('.loggedIn').hide();
          $('.loggedOut').show();
          $('textarea').each(function(index, attribute) {
            $(this).attr("disabled", "");
          });
        });
      } else { // no one session for this browser found
        $('.choiceModal').modal({backdrop: 'static', 'keyboard': false});
        $('li#username').children('a').text('');
        $('.loggedIn').hide();
        $('.loggedOut').show();
        $('textarea').each(function(index, attribute) {
          $(this).attr("disabled", "");
        });
      }
    }
  });
  drawDates();

  $("#subjects").append('<div class="row"><div class="col-sm-2 col-sm-offset-10" id="year"></div></div>')


});

function saveWeek(o) {
  db.get(ref.monday.toISOString()).then(function (w) {
    // update the document
    if (w.assignments != JSON.stringify(o)) {
      db.put({
        '_id': w._id,
        '_rev': w._rev,
        'assignments': JSON.stringify(o)
      });
    }
  }, function (err, response) {
    if(err) { // make a new document
      // console.log(err);
      db.put({
        '_id': ref.monday.toISOString(),
        'assignments': JSON.stringify(o),
      });
    } else {

    }
  });
}

function getWeek(c) {
  db.get(ref.monday.toISOString()).then(function(w) {
    c(JSON.parse(w.assignments));
  }, function (err, response) {
    if(err) { // make a new document
      c(genBlankAssignments());
      db.put({
        '_id': ref.monday.toISOString(),
        'assignments': JSON.stringify(genBlankAssignments())
      });
      
    } else {

    }
  });
}

function getAssignmentValues() {
  var d = {};
  $('textarea').each(function (index, ta) {
    d[ta.id] = [ta.value, $(this).css("text-decoration") == "line-through"];
  });
  return d;
}

function setAssignmentValues(d) {
  $('textarea').each(function (index, ta) {
    $(ta).css("text-decoration", "none solid rgb(0, 0, 0)");
    if (d[ta.id]) {
      $(ta).val(d[ta.id][0]);
      if (d[ta.id][1])
        $(ta).css("text-decoration", "line-through");
    }
    else
      $(ta).val('');
  });
}

function login(user, pswd, c, fail) {
  $.ajax({ // now get a new auth cookie from couch
    type: "POST",
    url: "/login", 
    data: {
      'username': user,
      'password': pswd
    },
    statusCode: {
      403: fail,
      500: function() {
        alert("There's been a server error. Contact NLTL for assistance.");
      }
    },
    success: function(data) {
      ref.user = data.user;
      db = new PouchDB('http://'+server+':5984/' + data.user);
      db.get("settings").then(function(settings) {
        renderRows(settings.rows);
        getWeek(setAssignmentValues);
      });
      
      if (c) c(data);
    }
  });
}

function signup(user, pswd, c, fail) {
  $.ajax({
    type: "POST",
    url: "/signup", 
    data: {
      'username': user,
      'password': pswd
    },
    statusCode: { 
      403: fail,
      500: function() {
        alert("There's been a server error. Contact NLTL for assistance.");
      }
    },
    success: function(data) {
      ref.user = data.user;
      db = new PouchDB('http://'+server+':5984/' + data.user);
      if (c) 
        c(data);
      getWeek(setAssignmentValues);
    }
  });
}


function renderRows(rows) {
    if ($('.container').width() >= 720) {
    for (var i = 1; i <= rows.length; i++) {
      var row = $("#planner").append('<div class="row"></div>');
      $("#subjects").append('<div class="row"><div class="col-sm-2 subj col-sm-offset-10" id="'+(i)+'">'+rows[i-1][0]+'</div></div>');
      for (var j = 1; j <= 5; j++) {
        if (j == 1)
          row.append('<div class="col-sm-2 col-sm-offset-2"><textarea id="'+ rows[i-1][1] + String(j)+'"></textarea></div>');
        else
          row.append('<div class="col-sm-2"><textarea id="'+ rows[i-1][1] + String(j)+'"></textarea></div>');
      }
    }
  } else {
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    for (var i = 1; i <= rows.length; i++) {
      $("#mobile-tabs").append('<li><a href="#'+ rows[i-1][0]+'" data-toggle="tab">'+rows[i-1][0]+'</a></li>');
      $('#mobile-tab-content').append('<div class="tab-pane" id="'+ rows[i-1][0] +'"></div>');
      for (var j = 1; j <= days.length; j++) {
        $('#' + rows[i-1][0]).append('<h3>' + days[j-1] + '</h3>');
        $('#' + rows[i-1][0]).append('<div><textarea id="'+ rows[i-1][1] + String(j)+'"></textarea></div>');
      }
    }
  }
}

function getMonday(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() - 1));
}


function genBlankAssignments() {
  var d = {};
  $('textarea').each(function (index, ta) {
    d[ta.id] = ['', false];
  });
  return d;
}


function drawDates() {
  $('.day').each(function(index, element) {
    var d = new Date(ref.monday.getFullYear(), ref.monday.getMonth(), ref.monday.getDate() + index);
    $(element).html('<span>' + $(element).children('span').html() + '</span> ' + (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getYear() % 100);
  });
}

$.fn.slide = function(dist, t, c) {
    var element = this[0];
    var p = $(element).css("position");
    $(element).css("position", "relative");
    if (!t)
        t = 500;
    $(element).animate({
        left: "+=" + dist
    }, t, function() {
        $(element).css({left: -dist});
        $(element).animate({left: 0}, t);
        if (c)
            c();
    });
    $(element).css("position", p);
}

String.prototype.escapeHTML = function() {
    return $('<div/>').text(this).html();
};