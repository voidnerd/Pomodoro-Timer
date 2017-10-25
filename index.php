<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>pomodoro Clock</title>

    <link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/styles.css">

</head>
<body>
    <div class="main-wrapper">
        <div class="timer-config">
            <button id="pomodoro-time-down" class="circle-button" type="button">
                <i class="fa fa-minus"></i>
            </button>

            <h3 id="pomodoro-time">25</h3>

            <button id="pomodoro-time-up" class="circle-button" type="button">
                <i class="fa fa-plus"></i>
            </button>
            <p>Cycle Timer</p>
        </div>
        <div class="ui-controls">
            <button id="break-time-down" class="circle-button" type="button">
                <i class="fa fa-minus"></i>
            </button>
            <h3 id="break-time">5</h3>
           
            <button id="break-time-up" class="circle-button" type="button">
                <i class="fa fa-plus"></i>
            </button>
            <p>Break Timer</p>
        </div>
        <div class="timer-display">
            <p id="timer">25:00</p>
            <p id="message-display">Click on play to start!</p>
        </div>
        <div class ="timer-controls">
            <i class="fa fa-lg fa-play" id="start"></i>
            <i class="fa fa-lg fa-pause" id="pause"></i>
            <i class="fa fa-lg fa-ban" id="reset"></i>

        </div>
    </div>

    <script src="index.js"></script>
    
</body>
</html>