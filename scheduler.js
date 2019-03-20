// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDMUhtkWknqkt6zPFRNaRhPyBe3gnjVsS4",
    authDomain: "trainscheduler-a22d1.firebaseapp.com",
    databaseURL: "https://trainscheduler-a22d1.firebaseio.com",
    projectId: "trainscheduler-a22d1",
    storageBucket: "trainscheduler-a22d1.appspot.com",
    messagingSenderId: "187392834024"  
};
firebase.initializeApp(config);

var database = firebase.database()


// get data from database
database.ref('/trains').on('child_added', function(snapshot){
  
  var trainName = snapshot.val().name
  var trainDestination = snapshot.val().destination
  var firstTrain = snapshot.val().firstTrain
  var frequency = snapshot.val().frequency

  firstTrain = firstTrain.split(':')
  firstTrain = moment().hours(firstTrain[0]).minutes(firstTrain[1]).seconds('00')
  console.log(firstTrain)

  //using max moment determine if train has already came at least once for the day
  //moment.max takes two moments and determines which one is further away
  var maxMoment = moment.max(moment(),firstTrain)
  if(maxMoment === firstTrain){
    console.log('train has not arrived once today')
    var minutesAway = firstTrain.diff(moment(),'minutes')
    var nextArrival = firstTrain.format('hh:mm')
  }
  else {
    console.log('train has came')
    //differenceTimes is how long it has passed since the first train of the day
    var differenceTimes = moment().diff(firstTrain,'minutes')
  

    //timeRemainder is the left over of taking the differenceTimes and modulous frequency
    var timeRemainder = differenceTimes % frequency

    //minutesAway takes the frequency minus the remainder.  This number is always less than the frequency
    var minutesAway = frequency - timeRemainder

    //nextArrival is the current time plus the minutes away.
    var nextArrival = moment().add(minutesAway,'m').format('hh:mm')

  }
  var newRow = `<tr>
      <td>${trainName}</td>
      <td>${trainDestination}</td>
      <td>${firstTrain.format("hh:mm")}</td>
      <td>${frequency}</td>
      <td>${nextArrival}</td>
      <td>${minutesAway}</td>
      </tr>
      `
  $('#train-table').append(newRow)
})


$('#add-train').on('submit', function(event){
  event.preventDefault()
  var name = $('#name').val()
  var destination = $('#destination').val()
  var firstTrain = $('#first-train').val()
  var frequency = $("#frequency").val()

  console.log(name, destination);

  database.ref('/trains').push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
    })    
})