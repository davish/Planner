var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// test user username is davish.

exports.get = function(req, res) {
  res.render("index");
}

exports.post = function(req, res) {
  // if (req.body.req = "sync")
  //   res.json(ref);
  mongoose.connect('mongodb://localhost/test');
  mongoose.connection.on('open', settingsInit);
}


var settingSchema = new Schema({
    name: String,
    user: String,
    data: String
});

var assignmentSchema = new Schema({
    user: String,
    week: Date,
    data: String
});

var scheduleSchema = new Schema({
    user: String,
    year: Date, // This date's just the year and the month; September it's semester 1, january semester 2.
    data: String
});

var currentEventsSchema = new Schema({
    monday: Date,
    data: String
});

var Setting = mongoose.model('setting', settingSchema);
var Week = mongoose.model('week', assignmentSchema);
var Schedule = mongoose.model('schedule', scheduleSchema);
var currentEvent = mongoose.model('currentEvents', currentEventsSchema);

function settingsInit() {
    new Setting({name: "colorCode", user: "all", data: JSON.stringify({
            "1": {
                "1": "B",
                "2": "A",
                "3": "E",
                "4": "F",
                "5": "I",
                "6": "K",
                "7": "H",
                "8": "G",
                "9": "Z"
            },
            "2": {
                "1": "C",
                "2": "D",
                "3": "H",
                "4": "G",
                "5": "I",
                "6": "K",
                "7": "B",
                "8": "A",
                "9": "Z"
            },
            "3": {
                "1": "E",
                "2": "F",
                "3": "H",
                "4": "G",
                "5": "J",
                "6": "K",
                "7": "D",
                "8": "C",
                "9": "Z"
            },
            "4": {
                "1": "B",
                "2": "A",
                "3": "D",
                "4": "C",
                "5": "I",
                "6": "K",
                "7": "E",
                "8": "F",
                "9": "Z"
            },
            "5": {
                "1": "E",
                "2": "F",
                "3": "A",
                "4": "B",
                "5": "I",
                "6": "K",
                "7": "G",
                "8": "H",
                "9": "Z"
            }
        })}).save();
    new Setting({name: "colors", user: "all", data: JSON.stringify({
            "A": "#00ff00",
            "B": "#ff0080",
            "C": "#029af5",
            "D": "#d75000",
            "E": "#ffd500",
            "F": "#00ffd5",
            "G": "#bc33ff",
            "H": "#5d5dfa",
            "I": "#12e29d",
            "J": "red",
            "K": "a7a7a7",
            "Z": "pink"
        })}).save();
    new Setting({name: "keywords", user: "davish", data: "(test|urgent|quiz|due|with)"}).save();
    new Setting({name: "kwStyle", user: "davish", data: JSON.stringify({
            "test": "high",
            "urgent":"high",
            "quiz": "mid",
            "due": "low",
            "with": "lab"
        })}).save();
    new Week({user: "davish", monday: getMonday(new Date()), data: JSON.stringify({
            11: "JERGENS", 12: "test", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 19: "", 
            21: "", 22: "side lard: jiggling!", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 
            31: "", 32: "", 33: "", 34: "smesmesme", 35: "test j period", 36: "", 37: "", 38: "", 39: "", 
            41: "", 42: "", 43: "", 44: "quiz", 45: "mass decreasing!", 46: "", 47: "", 48: "", 49: "", 
            51: "", 52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "", 59: "", 00: undefined
        })}).save();
    new Schedule({user: "davish", year: new Date(2014, 0), data: JSON.stringify({
            "1": {
                "1": "Algebra 2A",
                "2": "English",
                "3": "Parkhurst Biology",
                "4": "F",
                "5": "I",
                "6": "K",
                "7": "Spanish 3A",
                "8": "World History I",
                "9": "Z"
            },
            "2": {
                "1": "C",
                "2": "D",
                "3": "Spanish 3A",
                "4": "World History I",
                "5": "I",
                "6": "Percussion Ensemble",
                "7": "Algebra 2A",
                "8": "English",
                "9": "Z"
            },
            "3": {
                "1": "Parkhust Biology",
                "2": "Parkhurst Biology",
                "3": "Spanish 3A",
                "4": "World History I",
                "5": "J",
                "6": "Robotics",
                "7": "D",
                "8": "C",
                "9": "Z"
            },
            "4": {
                "1": "Algebra 2A",
                "2": "English",
                "3": "D",
                "4": "Computer Science 1",
                "5": "I",
                "6": "K",
                "7": "Parkhurst Biology",
                "8": "Robotics",
                "9": "Z"
            },
            "5": {
                "1": "Parkhurst Biology",
                "2": "Robotics",
                "3": "English",
                "4": "Algebra 2A",
                "5": "I",
                "6": "Science Seminar",
                "7": "World History I",
                "8": "Spanish 3A",
                "9": "Z"
            }
        })}).save();
    new currentEvent({
        monday: getMonday(new Date()), 
        data: JSON.stringify([["7th and 8th grade Lice checkups"], ["Side lard tests for everyone!"],[],["Rutgers Model UN conference", "Princeton Debate Tournament"],["Rutgers Model UN conference", "Princeton Debate Tournament", "Homecoming"], ["Rutgers Model UN conference"], []])
    }).save();
}

function getMonday(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() - 1));
}