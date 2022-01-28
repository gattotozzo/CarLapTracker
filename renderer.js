// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return minutes + ":" + seconds + ":" + milliseconds;
}

window.addEventListener("DOMContentLoaded", () => {
    let display = document.getElementById("big-display");
    let stopwatch = new Stopwatch();
    setInterval(() => {
        display.innerText = msToTime(stopwatch.read());
    }, 10);
    stopwatch.start();
});