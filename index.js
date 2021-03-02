"use strict"

const startBreathingCyclesButton = document.getElementById("start-breathing-cycles");
const breathingCycleCounterDisplay = document.getElementById("breathing-counter-display");
const retentionTimeDisplay = document.getElementById("retention-time-display");
const saveRetentionTimeButton = document.getElementById("save-retention-time");
const retentionTimesLog = document.getElementById("retention-times-log");
// intervall variable that {countdown}, {retentionTimer} and {saveRetentionTime} need access to
let timer;
// predicate to control flow in {countdown}
let holdingBreath = false;

/**
 * on first run disable start buttion, then start first countdown
 */
const disableStartButton = () => {
    startBreathingCyclesButton.setAttribute("style", "display: none");
    startBreathingCyclesButton.disabled = true;
    countdown(1, 2);
};

/**
 * countdown for breathing cycles
 * @param {Number} lenghtCycle length of each cycle in seconds
 * @param {Number} numberCycles number of breathing cycles
 */
const countdown = (lenghtCycle = 3, numberCycles = 30) => {
    if (breathingCycleCounterDisplay.style.display === "none") {
        breathingCycleCounterDisplay.setAttribute("style", "display: block");
    }
    let breathingCycleCounter = numberCycles;
    breathingCycleCounterDisplay.textContent = breathingCycleCounter;

    const countBackwards = setInterval(() => {
        breathingCycleCounter--;
        breathingCycleCounterDisplay.textContent = breathingCycleCounter;
        if (breathingCycleCounter <= 0) {
            clearInterval(countBackwards);
            if (holdingBreath === false) {
                retentionTimer();
            };
        };
    }, 1000 * lenghtCycle);
};

/**
 * measure time you can hold your breath
 * runs when {countdown} is finished, if it wasn't uset for holding breath
 * finishes when button "save-retention-time" is pressed
 */
const retentionTimer = () => {
    breathingCycleCounterDisplay.setAttribute("style", "display: none;");
    retentionTimeDisplay.setAttribute("style", "display: block;");
    saveRetentionTimeButton.setAttribute("style", "display: block;");

    let elapsedTime = 0;
    let pausedTime = 0;

    const integerPart = (float) => Math.trunc(float);
    const minutes = (float) => integerPart(float / 60);
    const seconds = (float) => integerPart(float) - minutes(float) * 60;
    const digits = (float) => integerPart((float - integerPart(float)) * 100);

    const displayFormat = (n) => { return n.toString().padStart(2, 0) }


    const startTime = Date.now();
    timer = setInterval(() => {

        elapsedTime = ((Date.now() - startTime) / 1000 + pausedTime);

        const elapsedMinutes = displayFormat(minutes(elapsedTime));
        const elapsedSeconds = displayFormat(seconds(elapsedTime));
        const elapsedDigits = displayFormat(digits(elapsedTime));

        retentionTimeDisplay.textContent = `${elapsedMinutes}:${elapsedSeconds}:${elapsedDigits}`

    }, 10);
};

/**
 * saves retention time to list
 */
const saveRetentionTime = () => {

    clearInterval(timer);
    retentionTimeDisplay.setAttribute("style", "display: none;");
    saveRetentionTimeButton.setAttribute("style", "display: none;");

    if (retentionTimesLog.style.display === "none") { retentionTimesLog.setAttribute("style", "display: block"); }

    const retentionTimesLogEntry = document.createElement("li");
    const retentionTimesLogEntryContent = document.createTextNode(retentionTimeDisplay.textContent);
    retentionTimesLogEntry.appendChild(retentionTimesLogEntryContent);
    retentionTimesLog.appendChild(retentionTimesLogEntry);

    // save retention time in seperate file together with current date
    // exportRetentionTime();

    holdBreath();
};

/**
 * hold breath for 15 seconds
 */
const holdBreath = () => {
    breathingCycleCounterDisplay.setAttribute("style", "display: block");
    holdingBreath = true;
    countdown(1, 15);
    holdingBreath = false;
    countdown();

};

/**
 * save retention time in seperate file together with current date
 */
const exportRetentionTime = () => { };



/**
 * Timm: timer clearen nicht richtig?
 */