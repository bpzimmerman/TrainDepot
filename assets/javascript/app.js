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

    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = 0;

    $("#submit-button").on("click", function(event){
        event.preventDefault();
        trainName = $("#train-input").val().trim();
        destination = $("#dest-input").val().trim();
        firstTrainTime = $("#time-input").val().trim();
        frequency = parseInt($("#freq-input").val().trim());
        $("#train-input").val("");
        $("#dest-input").val("");
        $("#time-input").val("");
        $("#freq-input").val("");
        database.ref().once("value").then(function(snap){
            var keys = snap.numChildren();
            database.ref("/" + (keys + 1)).set({
                train: trainName,
                dest: destination,
                time: firstTrainTime,
                freq: frequency
            });    
        });
    });

    database.ref().on("value", function(shot){
        $("#trainData").empty();
        if (shot.numChildren() > 0){
            for (var i = 1; i < (shot.numChildren() + 1); i += 1){
                var train = shot.val()[i].train;
                var dest = shot.val()[i].dest;
                var time = shot.val()[i].time;
                var freq = shot.val()[i].freq;

                var timeConverted = moment(time, "hh:mm").subtract(1, "years");
                var timeDifference = moment().diff(moment(timeConverted), "minutes");
                var remainder = timeDifference % freq;
                var minutesAway = freq - remainder;
                var nextArrival = moment().add(minutesAway, "minutes");

                var tableRow = $("<tr>");
                tableRow.attr("id", "row" + i);
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

                tableRow.append(trainItem, destItem, freqItem, next, min);
                $("#trainData").prepend(tableRow);
            };
        }
    })
});