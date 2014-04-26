$('document').ready(function() {
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

  $("form#login").submit(function(e) {
    e.preventDefault();
    login($('#loginUsername').val(), $('#loginPassword').val(), function(data) {
      $('.loginModal').modal('hide');
      $('li#username').children('a').text(data.user);
      $('.loggedIn').show();
      $('.loggedOut').hide();
      $('#403').hide();
      $('textarea').each(function(index, element) {
        element.removeAttribute('disabled');
      });
    }, function(data) {
      $('li#username').children('a').text('');
      $('#403').text('The username and password entered does not match.');
      $('#403').show();
    });
  });

  $("form#signup").submit(function(e) {
    e.preventDefault();
    if ($('#signupPasswordVerify').val() == $('#signupPassword').val()) {    
      signup($('#signupUsername').val(), $('#signupPassword').val(), function(data) {
        $('.signupModal').modal('hide');
        $('li#username').children('a').text(data.user);
        $('.loggedIn').show();
        $('.loggedOut').hide();
        $('#403').hide();
        $('textarea').each(function(index, element) {
          element.removeAttribute('disabled');
        });
      }, function(data) {
        $('li#username').children('a').text('');
        $('#403-1').text('This user already exists');
        $('#403-1').show();
      });
    } else {
      $('#403-1').text('The password you entered must match.');
      $('#403-1').show();
    }
  });

  $('#goToLogin').click(function() {
    $('.choiceModal').modal('hide');
    $('.loginModal').modal('show');
  });

  $('#goToSignup').click(function() {
    $('.choiceModal').modal('hide');
    $('.signupModal').modal('show');
  });

  $('.signupModal').on('hidden.bs.modal', function() {
    if ($('li#username').children('a').text() == "")
      $('.choiceModal').modal('show');
  });

  $('.loginModal').on('hidden.bs.modal', function() {
    if ($('li#username').children('a').text() == "")
      $('.choiceModal').modal('show');
  });

});