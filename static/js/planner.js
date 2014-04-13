var ref = {
  'monday': getMonday(new Date()),
  'rows': [["English", 1], ["World History", 2], ["Albgebra", 3], ["Biology", 7], ["Spanish", 4], ["Computer Science", 5], ["Labs", 6]],
  'user': undefined
};
var db = new PouchDB('planner');
var remoteCouch = false;
$('document').ready(function() {
  $.ajax({
    url: "/session",
    success: function(data) {
      if (data.username && data.password) {
        ref.user = data.username;
        $.ajax({
          type: "POST",
          // '/signup' capable of handling new or created users originally as an error-handling measure, but we'll just send everyone there
          url: "/login", 
          data: {
            'username': data.username,
            'password': data.password
          },
          statusCode: {
            403: function() {
              $('li#username').children('a').text('');
              $('.loggedIn').hide();
              $('.loggedOut').show();
            },
            500: function() {
              console.log("something's gone horribly wrong. check the server logs.");
            }
          },
          success: function(data) {
            $('li#username').children('a').text(data.user);
            $('.loggedIn').show();
            $('.loggedOut').hide();
            remoteCouch = new PouchDB('http://localhost:5984/' + data.user);
            sync();
          }
        });
      } else {
        $('li#username').children('a').text('');
        $('.loggedIn').hide();
        $('.loggedOut').show(); 
      }
    }
  });
  // $('.loggedIn').hide();
  // initializeSnake("snake");

  getWeek(setAssignmentValues);
  drawDates();

  $("#subjects").append('<div class="row"><div class="col-sm-2 col-sm-offset-10" id="year"></div></div>')

  for (var i = 1; i <= ref.rows.length; i++) {
    var row = $("#planner").append('<div class="row"></div>');
    $("#subjects").append('<div class="row"><div class="col-sm-2 subj col-sm-offset-10" id="'+(i)+'">'+ref.rows[i-1][0]+'</div></div>');
    for (var j = 1; j <= 5; j++) {
      if (j == 1)
        row.append('<div class="col-sm-2 col-sm-offset-2"><textarea id="'+ ref.rows[i-1][1] + String(j)+'"></textarea></div>');
      else
        row.append('<div class="col-sm-2"><textarea id="'+ ref.rows[i-1][1] + String(j)+'"></textarea></div>');
    }
  }

  /* 
    Event Handlers
  */

  var isiOS = false;
  var agent = navigator.userAgent.toLowerCase();
  if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
    isiOS = true;
  }

  if (!isiOS){
    $('textarea').dblclick(function() { // toggle between strikethrough and no styling on textareas
      if ($(this).css("text-decoration") == "none solid rgb(0, 0, 0)")
        $(this).css("text-decoration", "line-through");
      else
        $(this).css("text-decoration", "none solid rgb(0, 0, 0)");
    });
  } else {
    var action;
    $('textarea').bind('touchend', function(event){
      var now = new Date().getTime();
      var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */;
      var delta = now - lastTouch;
      clearTimeout(action);
      if (delta<500 && delta>0){
        if ($(this).css("text-decoration") == "none solid rgb(0, 0, 0)")
          $(this).css("text-decoration", "line-through");
        else
          $(this).css("text-decoration", "none solid rgb(0, 0, 0)");        
      } else {
        $(this).data('lastTouch', now);
        action = setTimeout(function(e){
         // If this runs you can invoke your 'click/touchend' code
         clearTimeout(action);   // clear the timeout
        }, 500, [event]);
      }
      $(this).data('lastTouch', now);
    });
  }

  $('a#save').click(function() {
    saveWeek(getAssignmentValues());
  });
  $('a#back').click(function() {
    // animation
    $('#weekend').slide($(window).width(), 200);
    $("#planner").slide($(window).width(), 200, function() {
      saveWeek(getAssignmentValues()); // save the current state
      ref.monday = new Date(ref.monday.getFullYear(), ref.monday.getMonth(), ref.monday.getDate() - 7); // decrement by 1 week
      getWeek(setAssignmentValues);
      drawDates();
    });
  });
  $('a#next').click(function() {
    $('#weekend').slide(-$(window).width(), 200);
    $("#planner").slide(-$(window).width(), 200, function() {
      saveWeek(getAssignmentValues());
      ref.monday = new Date(ref.monday.getFullYear(), ref.monday.getMonth(), ref.monday.getDate() + 7);
      getWeek(setAssignmentValues);
      drawDates();
    });
  });

  $("#loginSubmit").click(function() {
    $.ajax({
      type: "POST",
      // '/signup' capable of handling new or created users originally as an error-handling measure, but we'll just send everyone there
      url: "/signup", 
      data: {
        'username': $('#loginUsername').val(),
        'password': $('#loginPassword').val()
      },
      statusCode: {
        403: function() {
          $('li#username').children('a').text('');
          console.log("incorrect username and password");
        },
        500: function() {
          console.log("something's gone horribly wrong. check the server logs.");
        }
      },
      success: function(data) {
        $('.close#login').click();
        $('li#username').children('a').text(data.user);
        ref.user = data.user;
        $('.loggedIn').show();
        $('.loggedOut').hide();
        remoteCouch = new PouchDB('http://localhost:5984/' + data.user);
        sync();
      }
    });
  });
  $('li#logoutButton').click(function() {
    ref.user = undefined;
    $.ajax({
      url: "/logout",
      success: function() {
        $('.loggedOut').show();
        $('.loggedIn').hide();
      }
    });
  });
  $('textarea').dblclick(function() { // toggle between strikethrough and no styling on textareas
    if ($(this).css("text-decoration") == "none solid rgb(0, 0, 0)")
      $(this).css("text-decoration", "line-through");
    else
      $(this).css("text-decoration", "none solid rgb(0, 0, 0)");
  });

});


function sync() {
  console.log("syncing to %s", remoteCouch)
  var opts = {live: true, complete: syncError};
  db.replicate.to(remoteCouch, opts);
  db.replicate.from(remoteCouch, opts);
}

function syncError(err) {
  console.log('Sync has stopped.');
  remoteCouch = false;
} 


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
      // console.log(err);
      db.put({
        '_id': ref.monday.toISOString(),
        'assignments': JSON.stringify(genBlankAssignments())
      });
      c(genBlankAssignments());
    } else {

    }
  });
}

function getAssignmentValues() {
  var d = {};
  $('textarea').each(function (index, ta) {
    d[ta.id] = [ta.value, $(this).css("text-decoration") != "none solid rgb(0, 0, 0)"];
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
    if (index < 5) {
      var d = new Date(ref.monday.getFullYear(), ref.monday.getMonth(), ref.monday.getDate() + index);
      $(element).html('<span>' + $(element).children('span').html() + '</span> ' + (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getYear() % 100);
    }
  });
}

$.fn.slide = function(dist, t, c) {
    var element = this[0];
    var p = $(element).css("position");
    $(element).css("position", "relative");
    if (!t)
        t = 500
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