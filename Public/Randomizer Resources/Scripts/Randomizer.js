// -----JS CODE-----
//@input float delay = 0.21 {"widget":"slider", "min":0.01, "max":1.0, "step":0.01}
//@input SceneObject[] backgrounds
//@input SceneObject instructionText // Reference to the instruction text object

var hintsComponent = script.getSceneObject().createComponent("Component.HintsComponent");
var score = 0;
var isBackgroundShown = false; // Variable to track if a background has been shown

// Define thresholds for each aura
var thresholds = {
    "powerful": 5,
    "happy": 4,
    "cool": 2,
    "energetic": 20,
    "excited": 1,
    "affection": 3
};

function initialize() {
    if(script.backgrounds.length < 1) {
        print("WARNING: No backgrounds were added.");
        return;
    }
    
    // Disable all backgrounds initially
    for(var i = 0; i < script.backgrounds.length; i++) {
        if(script.backgrounds[i]) {
            script.backgrounds[i].enabled = false;
        } else {
            print("ERROR: Background " + i + " is not defined.");
        }
    }
    
    // Disable instruction text initially
    if(script.instructionText) {
        script.instructionText.enabled = false;
    }
}

var event;
event = script.createEvent("MouthOpenedEvent");
event.faceIndex = 0;
event.bind(function (eventData) {
    score+=1;
    logScore();
    checkScore();
});

event = script.createEvent("BrowsRaisedEvent");
event.faceIndex = 0;
event.bind(function (eventData) {
    score+=2;
    logScore();
    checkScore();
});

event = script.createEvent("KissStartedEvent");
event.faceIndex = 0;
event.bind(function (eventData) {
    score+=3;
    logScore();
    checkScore();
});

// Add BrowsLoweredEvent
event = script.createEvent("BrowsLoweredEvent");
event.faceIndex = 0;
event.bind(function (eventData) {
    score+=5;
    logScore();
    checkScore();
});

// Swap EyeBlinkEvent with SmileStartedEvent
event = script.createEvent("SmileStartedEvent");
event.faceIndex = 0;
event.bind(function (eventData) {
    score+=4;
    logScore();
    checkScore();
});

function logScore() {
    print("Current Score: " + score);
}

function checkScore() {
    // Check if a background has already been shown
    if (!isBackgroundShown) {
        // Check score against each aura threshold
        for (var aura in thresholds) {
            if (score >= thresholds[aura]) {
                // Display the aura background
                showBackground(aura);
                isBackgroundShown = true; // Set the flag to true
                // Disable instruction text
                if(script.instructionText) {
                    script.instructionText.enabled = false;
                }
                return;
            }
        }
        // If no aura background is applicable, display the default background
        showBackground("normal");
        isBackgroundShown = true; // Set the flag to true
    }
}

function showBackground(type) {
    // Enable the appropriate background based on the type
    for (var i = 0; i < script.backgrounds.length; i++) {
        if (script.backgrounds[i].name === type) {
            script.backgrounds[i].enabled = true;
        } else {
            script.backgrounds[i].enabled = false;
        }
    }
}

initialize();
