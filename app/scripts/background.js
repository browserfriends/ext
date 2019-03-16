let id = "NA";

let currentLat = 0;
let currentLon = 0;

const SERVER_ADDRESS = "https://btogether.herokuapp.com/api/";

fetch(SERVER_ADDRESS + "down/id")
  .then(function(response) {
    id = response.json()['id'];
  });

browser.runtime.onMessage.addListener(notify);

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

function notify(message, sender, sendResponse) {
  switch(message.intent){
    case 'getId':
      sendResponse({intent: 'id', id: id});
      break;
    case 'notify':
      createNotify(message.title, message.content);
      break;
    case 'sendMetric':
      sendMetric(message);
      break;
  }
}

function sendMetric(message) {
  fetch(SERVER_ADDRESS + "up/" + message.name,
    {
      method: "POST",
      body: prepBody(message)
    })
    .then(function(res){  })
}

function createNotify(title, content){
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("link.png"),
    "title": title,
    "message": content
  });
}

function execServerCommand(message){
  switch (message.type) {
    case 'notify':
      createNotify(message.title, message.content);
      break;
  }
  console.log(message);
}

setInterval(function () {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    if(position.coords.latitude !== currentLat || position.coords.longitude !== currentLon){
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;
      console.log(currentLat, currentLon);
      fetch(SERVER_ADDRESS + "up/loc",
        {
          method: "POST",
          body: prepBody({
            lat:  currentLat,
            lon: currentLon
          })
        })
        .then(function(res){  })
    }
  });

  fetch(SERVER_ADDRESS + "down/control")
    .then(function(response) {
      execServerCommand(JSON.parse(response));
    });



}, 3000);


function prepBody(body){
  body.id = id;
  return JSON.stringify(body);
}

console.log(`'Allo 'Allo! Event Page for Browser Action`)
