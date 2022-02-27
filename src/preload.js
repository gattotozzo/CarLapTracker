const Stopwatch = require("statman-stopwatch");
const { SerialPort } = require('serialport');
const now = require('performance-now');

window.SerialPort = SerialPort;
window.Stopwatch = Stopwatch;
window.perfnow = now;