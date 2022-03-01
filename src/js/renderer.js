// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var times = [];

function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);
  
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return minutes + ":" + seconds + ":" + milliseconds;
}

/*
window.addEventListener("DOMContentLoaded", () => {
    let display = document.getElementById("big-display");
    let stopwatch = new Stopwatch();
    setInterval(() => {
        display.innerText = msToTime(stopwatch.read());
    }, 10);
    stopwatch.start();
});
*/

const resetTabs = () => {
    $("[data-tab]").hide();
};
  
const selectTab = (tabName) => {
    resetTabs();
    $(`[data-tab="${tabName}"]`).show();
};

const listPorts = async () => {
    let ports = await SerialPort.list();
    ports = ports.filter(p => { 
        if (p.manufacturer) {
            return p.manufacturer.toLowerCase().includes("arduino");
        } else {
            return false;
        }
    });
    let portSel = document.getElementById("port-sel");
    portSel.innerHTML = "";
    ports.forEach(p => {
        let option = document.createElement("option");
        option.textContent = p.path;
        option.value = p.path;
        portSel.appendChild(option);
    });
}

const renderTimes = () => {
    $("#timelist").empty();
    times.reverse().forEach(t => {
        $("#timelist").append(
            $("<div>", { class: "time" })
            .append(
                $("<div>", { class: "timestamp" }).text(msToTime(t.time))
            )
            .append(
                $("<div>", { class: "racist-name" }).text(t.name)
            )
            );
    });
}

const hidePrompt = () => {
    $("#prompt").hide();
};

const showPrompt = (timo) => {
    $("#prompt").show();
    $("#time-val").val(timo);
};

const hidePromptClear = () => {
    $("#promptClear").hide();
};

const showPromptClear = () => {
    $("#promptClear").show();
};

const resizeElements = () => {
    let controls = document.getElementById("controls");
    let newHeight = window.innerHeight - 10 - document.getElementById("displayo").clientHeight;
    controls.style.height = `${newHeight}px`;
}



window.addEventListener("DOMContentLoaded", async () => {
    window.addEventListener("resize", resizeElements);
    resizeElements();
    hidePrompt();
    hidePromptClear();
    if (!window.localStorage.getItem("times")) {
        window.localStorage.setItem("times", JSON.stringify([]));
    } else {
        times = JSON.parse(window.localStorage.getItem("times"));
    } 
    renderTimes();
    resetTabs();
    selectTab("port-selector");
    listPorts();
    $("#refresh-ports").click(listPorts);
    $("#port-ok").click(() => {
        selectTab("main");
        let isInAutomode = false;
        let stopTime = 0;

        const disableAutomode = () => {
            isInAutomode = false;
            $('#autoimg').attr("src", "./imgs/no_car.svg");
        }; 

        if ($('#port-sel').val()) {
            let port = new SerialPort({
                path: $('#port-sel').val(),
                baudRate: 9600
            });
    
            port.on("data", (incomingData) => {
                let data = incomingData.toString().toLowerCase();
                if (isInAutomode) {
                    if (data.includes("start")) {
                        $('#startSw').click();
                    } else if (data.includes("end")) {
                        $('#stopSw').click();
                    }
                }
            });
        }

        let stopwatch = new Stopwatch();
        let display = $('#big-display');
        setInterval(() => {
            let delta = stopwatch.read();
            display.text(isNaN(delta) ? "00:00:00" : msToTime(delta));
        }, 10);

        $('#startSw').click(() => {
            if (stopwatch._state == stopwatch.STATES.INIT) {
                stopwatch.start();
            } else if (stopwatch._state == stopwatch.STATES.SPLIT) {
                stopwatch.startTime = window.perfnow() - stopTime;
                stopwatch.unsplit();
            }
        })
        $('#stopSw').click(() => {
            if (stopwatch._state == stopwatch.STATES.RUNNING) {
                stopTime = stopwatch.read();
                stopwatch.split();
                disableAutomode();
                showPrompt(stopTime);
            }
        })
        $('#resetSw').click(() => {
            stopwatch.stop();
            stopwatch.reset();
            disableAutomode();
        }) 
        $('#autoSw').click(() => {
            $('#autoimg').attr("src", "./imgs/waiting_car.svg");
            isInAutomode = true;
        })
        $('#deleteRec').click(() => {
            showPromptClear();
        })
    });
    
    $("#close-prompt").click(() => {
        $("#prompt-txt-field").val("");
        hidePrompt();
    });
    $("#confirm-prompt").click(() => {
        times.push({
            time:  parseInt($("#time-val").val()),
            name: $("#prompt-txt-field").val()
        });
        $("#prompt-txt-field").val("");
        window.localStorage.setItem("times", JSON.stringify(times));
        hidePrompt();
        renderTimes();
    });
      
    $("#close-promptClear").click(() => {
        $("#prompt-txt-field").val("");
        hidePromptClear();
    });
    $("#confirm-confirm-promptClear").click(() => {
        hidePromptClear();
        window.localStorage.clear();
        times = [];
        renderTimes();
    });

    

});