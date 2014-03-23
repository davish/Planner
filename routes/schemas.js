var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.settingSchema = new Schema({
    name: String,
    user: String,
    data: String
});

exports.assignmentSchema = new Schema({
    user: String,
    monday: Date,
    data: String
});

exports.scheduleSchema = new Schema({
    user: String,
    year: Date, // This date's just the year and the month; September it's semester 1, january semester 2.
    data: String
});

exports.currentEventsSchema = new Schema({
    monday: Date,
    data: String
});