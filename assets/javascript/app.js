$(document).ready(function(){
    // initialize firebase
    var config = {
        apiKey: "AIzaSyAGnxQ5UGj4OjYcJP57uCarhTA2BHVm7sM",
        authDomain: "fir-sucks-4a8f6.firebaseapp.com",
        databaseURL: "https://fir-sucks-4a8f6.firebaseio.com",
        projectId: "fir-sucks-4a8f6",
        storageBucket: "",
        messagingSenderId: "285162773561"
    };

    firebase.initializeApp(config);

    // declare the database variable
    var database = firebase.database();

    // declare the 
    // var trainName = "";
    // var destination = "";
    // var firstTrainTime = "";
    // var frequency = 0;

    // declare the variables for the interval timer
    var intervalId;
    var minutes = moment().format("mm");

    // function to build the train data table with the information in the database
    function trainInfo(){
        // event listener that runs when data is added to the firebase database
        database.ref().on("child_added", function(shot){
            // gets the child data from the database and assigns it to variables
            var train = shot.val().train;
            var dest = shot.val().dest;
            var time = shot.val().time;
            var freq = shot.val().freq;

            // performs the time calculations to get how many minutes away
            var timeConverted = moment(time, "hh:mm").subtract(1, "years");
            var timeDifference = moment().diff(moment(timeConverted), "minutes");
            var remainder = timeDifference % freq;
            var minutesAway = freq - remainder;
            var nextArrival = moment().add(minutesAway, "minutes");

            // creates the rows and items that will go into the table body
            var tableRow = $("<tr>");
            tableRow.attr("id", shot.key);
            var trainItem = $("<td>");
            trainItem.text(train);
            var destItem = $("<td>");
            destItem.text(dest);
            var freqItem = $("<td>");
            freqItem.text(freq);
            var min = $("<td>");
            min.text(minutesAway);
            var next = $("<td>");
            next.text(moment(nextArrival).format("hh:mm A"));
            // creates buttons to remove trains from the list
            var rem = $("<button>");
            rem.text("X");
            rem.attr("class", "btn btn-default remove");
            rem.attr("data-key", shot.key);

            // builds the complete row item and prepends it to the table
            tableRow.append(trainItem, destItem, freqItem, next, min, rem);
            $("#trainData").prepend(tableRow);
        }, function(errorObject){
            console.log("Errors handled: " + errorObject.code);
        });
    };    

    // event listener that runs when the submit button is clicked 
    $("#submit-button").on("click", function(event){
        event.preventDefault();
        // gets the values from the form and assigns them to variables
        var trainName = $("#train-input").val().trim();
        var destination = $("#dest-input").val().trim();
        var firstTrainTime = $("#time-input").val().trim();
        var frequency = parseInt($("#freq-input").val().trim());
        // clears the form
        $("#train-input").val("");
        $("#dest-input").val("");
        $("#time-input").val("");
        $("#freq-input").val("");
        // pushes the submitted form data into the firebase database
        database.ref().push({
            train: trainName,
            dest: destination,
            time: firstTrainTime,
            freq: frequency
        });
        // empty the train data table and call the function to rebuild the table with the updated information
        $("#trainData").empty();
        trainInfo();
    });

    // event listener to remove a train from the database and the list
    $(document).on("click", ".remove",function(){
        var k = $(this).attr("data-key");
        database.ref().child(k).remove();
        $("#" + k).empty();
    });

    // interval to change the next arrival time in the train data table
    intervalId = setInterval(function(){
        if (moment().format("mm") != minutes){
            $("#trainData").empty();
            trainInfo();
            minutes = moment().format("mm");
        };
    }, 1000 * 5);

    // initial function call to build the data table with the information in the database
    trainInfo();
});