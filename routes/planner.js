var mongoose = require('mongoose'),
    schemas = require('./schemas');
var Schema = mongoose.Schema;

// test username is davish.

exports.get = function(req, res) {
  res.render("index");
}

exports.post = function(req, res) {
    var ref = {}
    var reqM = new Date(req.body.monday);

    console.log(req.body);

    if (req.body.req == "sync") {
        getSettings("davish", ref, function() {
            getWeek("davish", getMonday(new Date(req.body.monday)), {}, ref, function() {
                res.json(ref);
            });
        });
    }
    else if (req.body.req == "prev") {
        getWeek("davish", new Date(reqM.getFullYear(), reqM.getMonth(), reqM.getDate() - 7), req.body.assignments, ref, function() {
            res.json(ref);
        });
    }
    else if (req.body.req == "next") {
        getWeek(new Date(reqM.getFullYear(), reqM.getMonth(), reqM.getDate() + 7), req.body.assignments, ref, function() {
            res.json(ref);
        });
    } else {
        res.json(500, {"error": "proper 'req' parameter not provided."});
    }
}


var Setting = mongoose.model('setting', schemas.settingSchema);
var Week = mongoose.model('week', schemas.assignmentSchema);
var Schedule = mongoose.model('schedule', schemas.scheduleSchema);
var currentEvent = mongoose.model('currentEvents', schemas.currentEventsSchema);


function getSettings(usr, obj, c) {
    Setting.findOne({"name": "colorCode"}, function(err, colorCode) {
        if (!err)
            obj.colorCode = JSON.parse(colorCode.data);
        Setting.findOne({"name": "colors"}, function(err, colors) {
            if (!err)
                obj.colors = JSON.parse(colors.data);
            Setting.findOne({"name": "keywords", "user": "davish"}, function(err, keywords) {
                if (!err)
                    obj.keywords = keywords.data;
                Setting.findOne({"name": "kwStyle", "user": usr}, function(err, kwStyle) {
                    if (!err)
                        obj.kwStyle = JSON.parse(kwStyle.data);
                    Schedule.findOne({"user": usr, "year": new Date(2014, 0)}, function(err, schedule) {
                        if (!err)
                            obj.schedule = JSON.parse(schedule.data);
                        if (c)
                            c();
                    });
                });
            });
        });
    });
}


function getWeek(usr, d, asst, obj, c) {
    Week.findOne({"user": usr, "monday": getMonday(new Date(d))}, function(err, week) {
        if (!week) {
            week = new Week({
                user: usr,
                monday: getMonday(new Date(d)),
                data: JSON.stringify(asst)
            });
            week.save(function() {
                obj.monday = week.monday;
                obj.assignments = JSON.parse(week.data);
            });
        } else {
            if (!err) {
                console.log(week);
                if (asst)
                    week.assignments = JSON.stringify(asst);
                week.save(function() {
                    obj.monday = week.monday;
                    obj.assignments = JSON.parse(week.data);
                });
            }
        }
        currentEvent.findOne({"monday": obj.monday}, function(err, events) {
            if (!events) {
                events = new currentEvent({
                    monday: obj.monday,
                    data: JSON.stringify([])
                });
                events.save(function() {
                    obj.currentEvents = JSON.parse(events.data);
                });
            } else {
                if(!err)
                    obj.currentEvents = JSON.parse(events.data);
            }
            if (c)
                c();
        });
    });
}

function getMonday(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() - 1));
}

function genAsst() {
    var obj = {};
    for (var i = 1; i <= 5; i++) {
        for (var j = 1; j <=9; j++) {
            obj[String(i)+String(j)] = "";
        }
    }
    return obj;
}