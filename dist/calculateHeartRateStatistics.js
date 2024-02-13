"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function calculateHeartRateStatistics(heartRateData) {
    var dailyStats = [];
    // Assuming heartRateData is sorted by date and time
    var dates = Array.from(new Set(heartRateData
        .filter(function (data) { return data && data.timestamps && data.timestamps.startTime; }) // Filter out undefined or null values
        .map(function (data) { return data.timestamps.startTime.split('T')[0]; })));
    var _loop_1 = function (date) {
        var dailyData = heartRateData.filter(function (data) { return data.timestamps.startTime.startsWith(date); });
        var beatsPerMinuteArray = dailyData.map(function (data) { return data.beatsPerMinute; });
        var min = Math.min.apply(Math, beatsPerMinuteArray);
        var max = Math.max.apply(Math, beatsPerMinuteArray);
        var median = calculateMedian(beatsPerMinuteArray);
        var latestDataTimestamp = dailyData[dailyData.length - 1].timestamps.endTime;
        dailyStats.push({
            date: date,
            min: min,
            max: max,
            median: median,
            latestDataTimestamp: latestDataTimestamp,
        });
    };
    for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
        var date = dates_1[_i];
        _loop_1(date);
    }
    return dailyStats;
}
function calculateMedian(array) {
    var sortedArray = array.slice().sort(function (a, b) { return a - b; });
    var middle = Math.floor(sortedArray.length / 2);
    if (sortedArray.length % 2 === 0) {
        return (sortedArray[middle - 1] + sortedArray[middle]) / 2;
    }
    else {
        return sortedArray[middle];
    }
}
// Read the heart rate data from the input file
var inputFilename = 'heartrate.json';
var inputData = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
// Calculate heart rate statistics
var heartRateStats = calculateHeartRateStatistics(inputData);
// Write the output to the output file
var outputFilename = 'output.json';
fs.writeFileSync(outputFilename, JSON.stringify(heartRateStats, null, 2));
console.log("Heart rate statistics calculated and saved to ".concat(outputFilename));
