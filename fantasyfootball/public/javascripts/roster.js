




//console.log(checked());


function roster(){
const button = document.getElementById('PlayerStats');
//const error = document.getElementById('errormessage');

//var username= $("#username");
//var password = $("#password");
const QuarterBack = document.getElementsByName('QuarterBack')[0].value;
const RunningBacks = document.getElementsByName('RunningBacks')[0].value;
const WideReceivers = document.getElementsByName('WideReceivers')[0].value;
const TightEnd = document.getElementsByName('TightEnd')[0].value;
console.log(QuarterBack);
console.log(RunningBacks);
console.log(WideReceivers);
console.log(TightEnd);
//const password = document.getElementById('password').value;
//const data={selectedplayers:window.players};
button.addEventListener('click', function() {
  console.log('button was clicked');
  //console.log(players);
  //console.log(username.length);
  //console.log(password);
  
	 window.location.href = "/listPlayers";  
});
}

