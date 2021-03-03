"use strict"

// const startBreathingCyclesButton = document.getElementById("start-breathing-cycles");
const breathingCycleCounterDisplay = document.getElementById("breathing-counter-display");
const retentionTimeDisplay = document.getElementById("retention-time-display");
const saveRetentionTimeButton = document.getElementById("save-retention-time");
const retentionTimesLog = document.getElementById("retention-times-log");

const render = (props) => {
        switch (props.state) {
            case 'breathing': {
                retentionTimesLog.setAttribute("style", "display: none");
                breathingCycleCounterDisplay.textContent = props.breathingCycleCounter;
                break;
            }
            case 'retention': {
                breathingCycleCounterDisplay.setAttribute("style", "display: none;");
                retentionTimeDisplay.setAttribute("style", "display: block;");
                saveRetentionTimeButton.setAttribute("style", "display: block;");

                retentionTimeDisplay.textContent = Math.trunc((Date.now() - props.retentionTime) / 1000);
                break;
            }
            case 'holdBreath': {
                retentionTimeDisplay.setAttribute("style", "display: none;");
                saveRetentionTimeButton.setAttribute("style", "display: none;");
                retentionTimesLog.setAttribute("style", "display: block");
                retentionTimesLog.innerHTML = "";

                props.retentionLog.forEach(logEntry => {
                    const entry = document.createElement("li");
                    const content = document.createTextNode(logEntry);
                    entry.appendChild(content);
                    retentionTimesLog.appendChild(entry)
                })

                breathingCycleCounterDisplay.setAttribute("style", "display: block");
                breathingCycleCounterDisplay.textContent = props.holdBreathCounter;
                break;
            }
            default: {
                throw new Error('Should never happen');
            }
        }
}

const main = () => {
    // config
    // these values shouldn't really change, in fact, they could be supplied
    // via `main` parameters
    const breathingCycleLength = 3;
    const breathingCycles = 3;

    // state
    // these values constantly change as part of `tick` and hooks
    let breathingCycleCounter = breathingCycles;
    let holdBreathCounter = 15;
    let retentionTime = 0;
    const retentionLog = [];
    /** @type {'breathing' | 'retention' | 'holdBreath'} */
    let state = 'breathing';

    // setup
    // runs _once_ before everything else, e.g. to setup the initial parts in
    // the DOM
    if (breathingCycleCounterDisplay.style.display === "none") {
        breathingCycleCounterDisplay.setAttribute("style", "display: block");
    }
    saveRetentionTimeButton.addEventListener('click', preHoldBreath);

    // state change hooks
    // these can run before / after every state change
    function preHoldBreath () {
        retentionLog.push((Date.now() - retentionTime) / 1000);
        retentionTime = 0;
        state = 'holdBreath';
    }

    // tick
    const tick = setInterval(() => {
        const _state = {
            state,
            breathingCycleCounter,
            retentionTime,
            retentionLog,
            holdBreathCounter,
        };
        console.log(_state)
        render(_state);
        switch (state) {
            case 'breathing': {
                if (breathingCycleCounter <= 0) {
                    breathingCycleCounter = breathingCycles;
                    retentionTime = Date.now();
                    state = 'retention';
                };                
                breathingCycleCounter--;
                break;
            }
            case 'retention': {
                // we wait until the button is pressed
                break;
            }
            case 'holdBreath': {
                holdBreathCounter--;
                if (holdBreathCounter <= 0) {
                    holdBreathCounter = 15;
                    state = 'breathing';
                }
                break;
            }
            default: {
                throw new Error('Should never happen');
            }
        }
    }, 1000);
}

main();
