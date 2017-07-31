$(document).ready(function(){

//Firebase
var config = {
    apiKey: "AIzaSyA3xlvuCTSJ00q7iCpkEeksfYyUpxcfZy4",
    authDomain: "train-scheduler-10d38.firebaseapp.com",
    databaseURL: "https://train-scheduler-10d38.firebaseio.com",
    projectId: "train-scheduler-10d38",
    storageBucket: "train-scheduler-10d38.appspot.com",
    messagingSenderId: "1067705258683"
  };
firebase.initializeApp(config)

var database = firebase.database();

//Button click
$("#submit").on("click", function(){

  //html variables
  var name = $('#nameInput').val().trim();
  var dest = $('#destInput').val().trim();
  var time = $('#timeInput').val().trim();
  var freq = $('#freqInput').val().trim();

  database.ref().push({
    name: name,
    dest: dest,
    time: time,
    freq: freq,
    timeAdded: firebase.database.ServerValue.TIMESTAMP
  });
  $("input").val('');
    return false;
});

database.ref().on("child_added", function(childSnapshot){
  
  var name = childSnapshot.val().name;
  var dest = childSnapshot.val().dest;
  var time = childSnapshot.val().time;
  var freq = childSnapshot.val().freq;

  console.log("Name: " + name);
  console.log("Destination: " + dest);
  console.log("Time: " + time);
  console.log("Frequency: " + freq);

  //convert train yime
  var freq = parseInt(freq);
  var currentTime = moment();
  var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
  var trainTime = moment(dConverted).format('HH:mm');
  
  
  //difference between times
  var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
  var tDifference = moment().diff(moment(tConverted), 'minutes');
  console.log("DIFFERENCE IN TIME: " + tDifference);
  var tRemainder = tDifference % freq;
  var minsAway = freq - tRemainder;
  var nextTrain = moment().add(minsAway, 'minutes');
  
  

 //Append input into trainTable
$('#currentTime').text(currentTime);
$('#trainTable').append(
    "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
    "</td><td id='destDisplay'>" + childSnapshot.val().dest +
    "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
    "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
    "</td><td id='awayDisplay'>" + minsAway  + '' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

}); //end document.ready
