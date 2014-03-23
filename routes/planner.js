var mongoose = require('mongoose'),
    schemas = require('./schemas');
var Schema = mongoose.Schema;

// test user username is davish.

exports.get = function(req, res) {
  res.render("index");
}

exports.post = function(req, res) {
    var ref = {}
    var reqM = new Date(req.body.monday);
    mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;
    
    if (req.body.req == "sync") {
        db.on('open', function() {
            getSettings(ref, function() {
                getWeek(getMonday(new Date(req.body.monday)), ref, function() {
                    db.close(function() {
                        res.json(ref);
                    });
                });
            });
        });
    } else if (req.body.req == "prev") {
        db.on('open', function() {
            ref.colorCode = req.body.colorCode;
            ref.colors = req.body.colors;
            ref.keywords = req.body.keywords;
            ref.kwStyle = req.body.kwStyle;
            ref.schedule = req.body.schedule;
            getWeek(new Date(reqM.getFullYear(), reqM.getMonth(), reqM.getDate() - 7), ref, function() {
                db.close(function) {
                    res.json(ref);
                }
            });
        });
    } else if (req.body.req == "next") {
        db.on('open', function() {
            ref.colorCode = req.body.colorCode;
            ref.colors = req.body.colors;
            ref.keywords = req.body.keywords;
            ref.kwStyle = req.body.kwStyle;
            ref.schedule = req.body.schedule;
            getWeek(new Date(reqM.getFullYear(), reqM.getMonth(), reqM.getDate() - 7), ref, function() {
                db.close(function) {
                    res.json(ref);
                }
            });
        });   
    }


    // if (req.body.req = "sync")
    //     res.json(ref);
}


var Setting = mongoose.model('setting', schemas.settingSchema);
var Week = mongoose.model('week', schemas.assignmentSchema);
var Schedule = mongoose.model('schedule', schemas.scheduleSchema);
var currentEvent = mongoose.model('currentEvents', schemas.currentEventsSchema);


function getSettings(obj, c) {
    Setting.findOne({"name": "colorCode"}, function(err, colorCode) {
        if (!err)
            obj.colorCode = JSON.parse(colorCode.data);
        Setting.findOne({"name": "colors"}, function(err, colors) {
            if (!err)
                obj.colors = JSON.parse(colors.data);
            Setting.findOne({"name": "keywords", "user": "davish"}, function(err, keywords) {
                if (!err)
                    obj.keywords = keywords.data;

                Setting.findOne({"name": "kwStyle", "user": "davish"}, function(err, kwStyle) {
                    if (!err)
                        obj.kwStyle = JSON.parse(kwStyle.data);
                    Schedule.findOne({"user": "davish", "year": new Date(2014, 0)}, function(err, schedule) {
                        if (!err)
                            obj.schedule = JSON.parse(schedule.data);
                        c && c();
                    });
                });
            });
        });
    });

}


function getWeek(d, obj, c) {
    Week.findOne({"user": "davish", "monday": getMonday(new Date(d))}, function(err, week) {
        if (!err) {
            obj.monday = week.monday;
            obj.assignments = JSON.parse(week.data);
        } 
        currentEvent.findOne({"monday": obj.monday}, function(err, events) {
            if(!err)
                obj.currentEvents = JSON.parse(events.data);
            c && c();
        });
    });
}

function getMonday(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() - 1));
}