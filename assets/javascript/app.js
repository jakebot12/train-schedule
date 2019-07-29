$(document).ready(function() {
 
  var config = {
    apiKey: "AIzaSyCoKHz349aZt0eU5BgU8OZ1sxAHn7iB3gY",
    authDomain: "train-scheduler-ce7a8.firebaseapp.com",
    databaseURL: "https://train-scheduler-ce7a8.firebaseio.com",
    projectId: "train-scheduler-ce7a8",
    storageBucket: "train-scheduler-ce7a8.appspot.com",
    messagingSenderId: "946454989885",
    appId: "1:946454989885:web:d9ba0a2507c90a42"
  };
  firebase.initializeApp(config);

  var db = firebase.database();

  $("#add-train").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();
    frequency = $("#frequency-input")
      .val()
      .trim();
    first = $("#first-input")
      .val()
      .trim();

    db.ref().push({
      name: name,
      destination: destination,
      frequency: frequency,
      first: first,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  db.ref().on(
    "child_added",
    function(snapshot) {
      console.log(snapshot.val());
      console.log(snapshot.val().name);
      console.log(snapshot.val().destination);
      console.log(snapshot.val().first);
      console.log(snapshot.val().frequency);

      var first = snapshot.val().first;
      var frequency = snapshot.val().frequency;

      var row = $("<tr></tr>");
      var col1 = $("<td></td>").text(snapshot.val().name);
      row.append(col1);

      var col2 = $("<td></td>").text(snapshot.val().destination);
      row.append(col2);

      var col3 = $("<td></td>").text(snapshot.val().frequency);
      row.append(col3);

      var oneYearAgo = moment(first, "HH:mm").subtract(1, "years");

      var timeDifference = moment().diff(moment(oneYearAgo), "minutes");

      var remainder = timeDifference % frequency;

      var minutesToArrive = frequency - remainder;

      var next = moment().add(minutesToArrive, "minutes");

      var col4 = $("<td></td>").text(next);
      row.append(col4);

      var col5 = $("<td></td>").text(minutesToArrive);
      row.append(col5);

      $("#train-schedule").append(row);
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
});