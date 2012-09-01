$(document).ready(function() {
  $('#save').click(function() {           
    $.ajax({
      dataType: "json",
      data: {'mondayeng': $("textarea#mondayeng").val(), 'tuesdayeng': $("textarea#tuesdayeng").val(), 'wednesdayeng': $("textarea#wednesdayeng").val(), 'thursdayeng': $("textarea#thursdayeng").val(), 'fridayeng': $("textarea#fridayeng").val(), 
            'mondayhist': $("textarea#mondayhist").val(), 'tuesdayhist': $("textarea#tuesdayhist").val(), 'wednesdayhist': $("textarea#wednesdayhist").val(), 'thursdayhist': $("textarea#thursdayhist").val(), 'fridayhist': $("textarea#fridayhist").val(), 
            'mondaymath': $("textarea#mondaymath").val(), 'tuesdaymath': $("textarea#tuesdaymath").val(), 'wednesdaymath': $("textarea#wednesdaymath").val(), 'thursdaymath': $("textarea#thursdaymath").val(), 'fridaymath': $("textarea#fridaymath").val(), 
            'mondaysci': $("textarea#mondaysci").val(), 'tuesdaysci': $("textarea#tuesdaysci").val(), 'wednesdaysci': $("textarea#wednesdaysci").val(), 'thursdaysci': $("textarea#thursdaysci").val(), 'fridaysci': $("textarea#fridaysci").val(), 
            'mondaylang': $("textarea#mondaylang").val(), 'tuesdaylang': $("textarea#tuesdaylang").val(), 'wednesdaylang': $("textarea#wednesdaylang").val(), 'thursdaylang': $("textarea#thursdaylang").val(), 'fridaylang': $("textarea#fridaylang").val(), 
            'mondayother': $("textarea#mondayother").val(), 'tuesdayother': $("textarea#tuesdayother").val(), 'wednesdayother': $("textarea#wednesdayother").val(), 'thursdayother': $("textarea#thursdayother").val(), 'fridayother': $("textarea#fridayother").val(), 
            'notes': $("textarea#notes").val(),
            'action': "save", 'date': $("#date").text()
      },
      type: "POST",

      success: function(data) {      
        $("span#date").text(data['date']);
        //delete data['date']
        $("#assignments").find("textarea").each(function() {
          $(this).text("");
          $(this).val(data[$(this).attr("id")]);
        });
        console.log(data)
      } 
      
    });
  });

  $("#back").click(function() {
    $.ajax({
      dataType: "json",
      data: {'mondayeng': $("textarea#mondayeng").val(), 'tuesdayeng': $("textarea#tuesdayeng").val(), 'wednesdayeng': $("textarea#wednesdayeng").val(), 'thursdayeng': $("textarea#thursdayeng").val(), 'fridayeng': $("textarea#fridayeng").val(), 
            'mondayhist': $("textarea#mondayhist").val(), 'tuesdayhist': $("textarea#tuesdayhist").val(), 'wednesdayhist': $("textarea#wednesdayhist").val(), 'thursdayhist': $("textarea#thursdayhist").val(), 'fridayhist': $("textarea#fridayhist").val(), 
            'mondaymath': $("textarea#mondaymath").val(), 'tuesdaymath': $("textarea#tuesdaymath").val(), 'wednesdaymath': $("textarea#wednesdaymath").val(), 'thursdaymath': $("textarea#thursdaymath").val(), 'fridaymath': $("textarea#fridaymath").val(), 
            'mondaysci': $("textarea#mondaysci").val(), 'tuesdaysci': $("textarea#tuesdaysci").val(), 'wednesdaysci': $("textarea#wednesdaysci").val(), 'thursdaysci': $("textarea#thursdaysci").val(), 'fridaysci': $("textarea#fridaysci").val(), 
            'mondaylang': $("textarea#mondaylang").val(), 'tuesdaylang': $("textarea#tuesdaylang").val(), 'wednesdaylang': $("textarea#wednesdaylang").val(), 'thursdaylang': $("textarea#thursdaylang").val(), 'fridaylang': $("textarea#fridaylang").val(), 
            'mondayother': $("textarea#mondayother").val(), 'tuesdayother': $("textarea#tuesdayother").val(), 'wednesdayother': $("textarea#wednesdayother").val(), 'thursdayother': $("textarea#thursdayother").val(), 'fridayother': $("textarea#fridayother").val(), 
            'notes': $("textarea#notes").val(),
            'action': "back", 'date': $("#date").text()
      },
      type: "POST",
      success: function(data) {                
        $("span#date").text(data['date']);
        //delete data['date']
        $("#assignments").find("textarea").each(function() {
          $(this).text("");
          $(this).val(data[$(this).attr("id")]);
        });
        console.log(data)
      }
      
    });
  });

  $("#next").click(function() {            
    $.ajax({
      dataType: "json",
      data: {'mondayeng': $("textarea#mondayeng").val(), 'tuesdayeng': $("textarea#tuesdayeng").val(), 'wednesdayeng': $("textarea#wednesdayeng").val(), 'thursdayeng': $("textarea#thursdayeng").val(), 'fridayeng': $("textarea#fridayeng").val(), 
            'mondayhist': $("textarea#mondayhist").val(), 'tuesdayhist': $("textarea#tuesdayhist").val(), 'wednesdayhist': $("textarea#wednesdayhist").val(), 'thursdayhist': $("textarea#thursdayhist").val(), 'fridayhist': $("textarea#fridayhist").val(), 
            'mondaymath': $("textarea#mondaymath").val(), 'tuesdaymath': $("textarea#tuesdaymath").val(), 'wednesdaymath': $("textarea#wednesdaymath").val(), 'thursdaymath': $("textarea#thursdaymath").val(), 'fridaymath': $("textarea#fridaymath").val(), 
            'mondaysci': $("textarea#mondaysci").val(), 'tuesdaysci': $("textarea#tuesdaysci").val(), 'wednesdaysci': $("textarea#wednesdaysci").val(), 'thursdaysci': $("textarea#thursdaysci").val(), 'fridaysci': $("textarea#fridaysci").val(), 
            'mondaylang': $("textarea#mondaylang").val(), 'tuesdaylang': $("textarea#tuesdaylang").val(), 'wednesdaylang': $("textarea#wednesdaylang").val(), 'thursdaylang': $("textarea#thursdaylang").val(), 'fridaylang': $("textarea#fridaylang").val(), 
            'mondayother': $("textarea#mondayother").val(), 'tuesdayother': $("textarea#tuesdayother").val(), 'wednesdayother': $("textarea#wednesdayother").val(), 'thursdayother': $("textarea#thursdayother").val(), 'fridayother': $("textarea#fridayother").val(), 
            'notes': $("textarea#notes").val(),
            'action': "next", 'date': $("#date").text()
      },
      type: "POST",
      success: function(data) {            
        $("span#date").text(data['date']);
        //delete data['date']
        $("#assignments").find("textarea").each(function() {
          $(this).text("");
          $(this).val(data[$(this).attr("id")]);
        });
        console.log(data)
      } 
      
    });
  });
});
        