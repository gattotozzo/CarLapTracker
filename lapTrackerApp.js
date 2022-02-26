const { SerialPort } = require('serialport');
const Stopwatch = require("statman-stopwatch");

const stopwatch = new Stopwatch();
console.log("Waiting for start...");

(async function() {
    let ports = await SerialPort.list();
    let target = ports.find(p => p.manufacturer == "Arduino LLC");
    if (target) {
        const port = new SerialPort({
            path: target.path,
            baudRate: 9600
        });
        let data = "";
        port.on("data", (incomingData) => {
            data += incomingData.toString();
            if (data.endsWith("\r\n")) {
                data = data.replace("\r\n", "");
                if (data == "Start" && isNaN(stopwatch.read())) {
                    console.log("🎉🎉🎉 Timer started 🎉🎉🎉");
                    stopwatch.start();
                }
                if (data == "End" && !isNaN(stopwatch.read())) {
                    stopwatch.stop();
                    console.log("⏱️ End of the run");
                    console.log(msToTime(stopwatch.read()));
                    stopwatch.reset();
                }
                //console.log(`Received: ${data}`);
                data = "";
            }
        });
    }
}());

function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return minutes + ":" + seconds + "." + milliseconds;
}