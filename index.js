let name;
let roomName;
let html="";
const monthArr=["January","February","March","April","May","June","July","August","September","October","November","December"];
$(document).ready(function(){
	var firebaseConfig = {
    apiKey: "AIzaSyBBGwWeVlRAxwh0RY-crECKNN3mOOPp9bQ",
    authDomain: "chatwebapp-13de4.firebaseapp.com",
    databaseURL: "https://chatwebapp-13de4.firebaseio.com",
    projectId: "chatwebapp-13de4",
    storageBucket: "chatwebapp-13de4.appspot.com",
    messagingSenderId: "459854653307",
    appId: "1:459854653307:web:7a19cac4199c54955fbfde",
    measurementId: "G-4CT0EJLNZH"
  };

  $('#message').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
      sendMessage(); 
     }
   }); 

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  let i=0;
  roomName=prompt("Enter room Name you want to create/ otherwise enter partner room name");
  firebase.database().ref(roomName).on("child_added", function(snapshot){
	console.log(snapshot.val(),i);
	i++;
	addMessage(snapshot);
});
	name=prompt("Enter your name");
});

 

function sendMessage(){
  let messsage=$('#message').val();
  if(messsage.trim()==""){
    return;
  }
  let date=new Date();
	firebase.database().ref(roomName).push().set({
		"sender":name,
    "message":messsage,
    "date":date.getDate(),
    "year":date.getFullYear(),
    "month":date.getMonth(),
    "hour":date.getHours(),
    "minute":date.getMinutes(),
    "seconds":date.getSeconds()
  });
  $('#message').val("")
}

function playSound(){
  var aSound = document.createElement('audio');
  aSound.setAttribute('src', 'audio/insight.mp3');
  aSound.play();
}

function addMessage(snapshot){
  let hour=snapshot.val().hour%12;
  let min=snapshot.val().minute;
  let ses=snapshot.val().hour>=12?"PM":"AM";
  let month=monthArr[snapshot.val().month];
  let date=snapshot.val().date;
  let dateString;
  if(min==new Date().getMinutes()){
    playSound();
  }
  min=min<=9?"0"+min:min;
  date=date<=9?"0"+date:date;
  hour=hour<=9?"0"+hour:hour;
  dateString=hour+":"+min+" "+ses+" | "+month+" "+date;
  let dateStringWithName=snapshot.val().sender+", "+dateString;

  

  if(snapshot.val().sender!=name){
    html+='<div class="incoming_msg" id="'+snapshot.key+'">\
  <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>\
  <div class="received_msg">\
    <div class="received_withd_msg">\
    <p>'+snapshot.val().message+'</p><span class="time_date"> '+dateStringWithName+'</span></div>\
    </div>\
  </div>';
  }
  else{
    html+='<div class="outgoing_msg" id="'+snapshot.key+'" tabindex="1">\
    <div class="sent_msg">\
      <p>'+snapshot.val().message+'</p>\
      <span class="time_date"> '+dateString+'</span> </div>\
  </div>';
  }
  $('.msg_history').html(html);
  if(snapshot.val().sender==name){
    $('#recent-name').text("You");
  }
  else{
    $('#recent-name').text(snapshot.val().sender);
  }
  $("#recent-message").text(snapshot.val().message);
  $(".chat_date").text(dateString);
  $('#'+snapshot.key).focus();
  $('#message').focus();
  console.log(snapshot);
}