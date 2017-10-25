var Pomodoro = function(pomodoroTime, breakTime, displayElementId, messageDisplayId) {
	this.cycle = pomodoroTime * 60;		// Pomodoro cycle in seconds. (We pass in minutes)
	this.break = breakTime * 60;		// Break cycle in seconds.(We pass in minutes)
	this.state = 0;						// Initial state.
	this.lastState = 2;					// This additional property will be useful if we pause and want to go back to a break or pomodoro state. We set it to a pomodoro cycle state, since it will be the first that will run every time.
	this.timeLeft = pomodoroTime * 60;	// Time left is initialized to be the same as a pomodoro cycle.
	this.timerDisplay = displayElementId;	// ID for the DOM element where we want the time to be updated in.
	this.messageDisplay = messageDisplayId; // ID for the DOM element where we want to display messages for the user.
}


Pomodoro.prototype.start = function() {				// START method.
    var self = this;                                // We create the variable self and have it be a reference to this. Why? Because inside the tick() function, "this" will refer to the function itself, and not the Pomodoro. So we'll use self instead of this.
	if (this.state === 0 || this.state === 1) {		// If clock is stopped or paused:
		this.newState(this.lastState === 2 ? 2 : 3);	// Set state to running pomodoro to a break or pomodoro state. We use the newState method (we'll write it later on) and check what the lastState value is in case we have paused before.
		tick();										// Tick function runs once (this is only done so that UI feedback is instantaneous and we don't need to wait for the interval).
		this.timer = setInterval(function() {		// We create an interval that will run tick() every second.
			tick();
		}, 1000);
	}
    
    // Notice the use of the self variable inside the function.
	function tick() {						// The tick() function:
		self.timeLeft = self.timeLeft - 1;	// It decreases the cycle time by one.
        self.updateDisplay(self.timeLeft);	// Updates the display div that we passed in to the function (we'll create this method in just a second);
        if (self.timeLeft === 0) {			// If time reaches zero, we start a pomodoro cycle or break cycle depending on the current state.
            self.timeLeft = self.state === 2 ? self.break : self.cycle;	// We reset the timeLeft property to the next cycle.
            self.newState(self.state === 2 ? 3 : 2);	// We change the state to the next cycle.
        }
	}
}

Pomodoro.prototype.pause = function() {		// PAUSE method.
    if (this.state === 2 || this.state === 3) { // Make sure that the clock is running and not already paused.
	    this.newState(1);					    // Set's current state to paused.
        clearInterval(this.timer);				// Clears the interval we created previously.
    }
}

Pomodoro.prototype.reset = function() {		// RESET method.
    this.newState(0);					    // Set the state to the initial state.
    this.timeLeft = this.cycle;				// Set the timer to a pomodoro cycle.
    clearInterval(this.timer);				// Clears the previous interval.
    this.updateDisplay(this.timeLeft);		// Updates the display.
}

Pomodoro.prototype.updateDisplay = function(time, message) {		// UPDATE DISPLAY method.
    document.getElementById(this.timerDisplay).innerText = getFormattedTime(time);	// We get the display element using it's ID and set the content to the time left.
    if (message) { // Displays a message to the user if there is one.
        document.getElementById(this.messageDisplay).innerText = message;   
    }				
 
    function getFormattedTime(seconds) {			// This function formats the given seconds to look like: XX:YY
        var minsLeft = Math.floor(seconds / 60),
            secondsLeft = seconds - (minsLeft * 60);
 
        return zeroPad(minsLeft) + ':' + zeroPad(secondsLeft);
 
        function zeroPad(number) {
            return number < 10 ? '0' + number : number;
        }
    }
}

Pomodoro.prototype.updateTimes = function(cycleTime, breakTime) {	// UPDATE TIMES method. We'll use this method to update the times when the user changes them in the UI.
    this.cycle = cycleTime * 60;	// Set the pomodoro cycle.
    this.break = breakTime * 60;	// Set the break cycle.
    this.reset();					// Reset the clock.
}

Pomodoro.prototype.newState = function(state) {
	this.lastState = this.state;              // Set lastState to current state.
	this.state = state;                       // Updates current state.
	var message, audioFile;
	switch (state) {
		case 0:   // If state is 0, set lastState to 2 and set message content and color.
            this.lastState = 2;
            console.info('New state set: Initial state.');
			message = 'Click on play to start!';
			document.getElementById('timer').style.color = '#E47143';
			break;
		case 1:   // If state is 1, set audio file to play, message content and color.
            console.info('New state set: Paused.');
            audioFile = 'http://oringz.com/oringz-uploads/sounds-882-solemn.mp3';
			message = 'Paused.';
			document.getElementById('timer').style.color = '#CED073';
			break;
		case 2:   // If state is 2, set audio file to play, message content and color.
            console.info('New state set: Pomodoro Cycle.');
            audioFile = 'http://oringz.com/oringz-uploads/sounds-766-graceful.mp3';
			message = 'WORK WORK!';
			document.getElementById('timer').style.color = '#C19AEA';
			break;
		case 3:   // If state is 3, set audio file to play, message content and color.
            console.info('New state set: Break cycle.');
            audioFile = 'http://oringz.com/oringz-uploads/31_oringz-pack-nine-15.mp3';
			message = 'Break time! Use your time wisely!';
			document.getElementById('timer').style.color = '#53C56C';
	}
    
    // If state is 1, 2 or 3, play audio file.
    if (state === 1 || state === 2 || state === 3) {
        var audio = new Audio(audioFile);
        audio.play();
    }
    
    // Update display with current time and message.
	this.updateDisplay(this.timeLeft, message);
}

var elPomodoroTime = document.getElementById('pomodoro-time'),	// Pomodoro cycle time display.
    elBreakTime = document.getElementById('break-time'),		// Break cycle time display.
    elPomUp = document.getElementById('pomodoro-time-up'),		// Increase pomodoro time button.
    elPomDown = document.getElementById('pomodoro-time-down'),	// Decrease pomodoro time button.
    elBreakUp = document.getElementById('break-time-up'),		// Increase break time button.
    elBreakDown = document.getElementById('break-time-down'),	// Decrease break time button.
    elStart = document.getElementById('start'),					// Start button.
    elPause = document.getElementById('pause'),					// Pause button.
    elReset = document.getElementById('reset');

var myPomodoro = new Pomodoro(25, 5, 'timer', 'message-display'); // initializing pomodoro


elStart.addEventListener('click', function() {	// Start button.
    myPomodoro.start();	// We call the start method.
});
 
elPause.addEventListener('click', function() { // Pause button.
   myPomodoro.pause();	// We call the pause method.
});
 
elReset.addEventListener('click', function() { // Reset button.
   myPomodoro.reset();	// We call the reset method.
});

elPomUp.addEventListener('click', function() {	// Increase pomodoro time button.
    elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText)++;	// We increase the pomodoro cycle value by one.
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});

elPomDown.addEventListener('click', function() {
    elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) === 1 ? 1 : parseInt(elPomodoroTime.innerText) - 1;	// We decrease the pomodoro cycle value by one. Additionally, we check if the current time is 1, since we can't go any lower!
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});

elBreakUp.addEventListener('click', function() {
    elBreakTime.innerText = parseInt(elBreakTime.innerText)++;	// We increase the break cycle value by one.
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});

elBreakDown.addEventListener('click', function() {
    elBreakTime.innerText = parseInt(elBreakTime.innerText) === 1 ? 1 : parseInt(elBreakTime.innerText) - 1;	// We decrease the break cycle value by one. (And check for the lowest value! (1))
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});

elPomUp.addEventListener('click', function() {	// Increase pomodoro time button.
    elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) + 1;	// We increase the pomodoro cycle value by one.
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});
 
elPomDown.addEventListener('click', function() {
    elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) === 1 ? 1 : parseInt(elPomodoroTime.innerText)--;	// We decrease the pomodoro cycle value by one. Additionally, we check if the current time is 1, since we can't go any lower!
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});
 
elBreakUp.addEventListener('click', function() {
    elBreakTime.innerText = parseInt(elBreakTime.innerText) + 1;	// We increase the break cycle value by one.
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});
 
elBreakDown.addEventListener('click', function() {
    elBreakTime.innerText = parseInt(elBreakTime.innerText) === 1 ? 1 : parseInt(elBreakTime.innerText)--;	// We decrease the break cycle value by one. (And check for the lowest value! (1))
    myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);	// Update pomodoro.
});

