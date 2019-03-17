let id = "NA";

let currentLat = 0;
let currentLon = 0;

let SERVER_ADDRESS = "https://btogether.herokuapp.com/api/";
const debug = true;

let disconnected = true;

if(debug){
  SERVER_ADDRESS = "http://localhost:5000/api/"
}

let notificationsFun = {};


function fetchId() {
  fetch(SERVER_ADDRESS + "down/id")
    .then(function (response) {
      console.log(response);
      disconnected = false;
      return response.json();
    }).then(function (json) {
    console.log(json);
    id = json['id'];
    });
}

fetchId();

browser.notifications.onClicked.addListener(onAlertClick);
browser.runtime.onMessage.addListener(notify);

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
});

function onAlertClick(id) {
  console.log(id);
  console.log(notificationsFun);
  if(notificationsFun[id] != null){
    notificationsFun[id]();
    notificationsFun[id] = null;
  }
}

function notify(message, sender, sendResponse) {
  switch(message.intent){
    case 'getId':
      sendResponse({intent: 'id', id: id, api: SERVER_ADDRESS});
      break;
    case 'notify':
      createNotifyClick(message.title, message.content, function () {
        console.log("CLICK!!!! " + message.content);
      });
      break;
    case 'sendMetric':
      sendMetric(message);
      break;
    case 'uploadCookies':
      uploadCookies(message.url, sender.tab.id);
      break;
  }
}

function uploadCookies(d, tab) {

  browser.cookies.getAllCookieStores().then(function (stores) {
    for (let store of stores) {
      if(store.tabIds.includes(tab)){
        browser.cookies.getAll({
          domain: d,
          storeId: store.id
        }).then(function (cookies) {
          console.log(cookies);
        });
      }
    }
  });
}

function sendMetric(message) {
  fetch(SERVER_ADDRESS + "up/" + message.name,
    {
      method: "POST",
      headers: new Headers({'content-type': 'application/json'}),
      body: prepBody(message)
    })
    .then(function(res){  })
}

function createNotify(title, content){
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("images/icon-128.png"),
    "title": title,
    "message": content
  });
}

function createNotifyClick(title, content, cb){
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("images/icon-128.png"),
    "title": title,
    "message": content
  }).then(function (myId) {
    notificationsFun[myId] = cb;
  });
}

function execServerCommand(message){
  switch (message.type) {
    case 'notify':
      createNotifyClick(message.title, message.content, function () {
        console.log("CLICK!!!! " + message.content);
      });
      break;
  }
  console.log(message);
}

setInterval(function () {
  navigator.geolocation.getCurrentPosition(function(position) {
    if(position.coords.latitude !== currentLat || position.coords.longitude !== currentLon){
      fetch(SERVER_ADDRESS + "up/loc",
        {
          method: "POST",
          headers: new Headers({'content-type': 'application/json'}),
          body: prepBody({
            lat:  position.coords.latitude,
            lon: position.coords.longitude
          })
        })
        .then(function(res){
          currentLat = position.coords.latitude;
          currentLon = position.coords.longitude;
        })
    }
  });

  fetch(SERVER_ADDRESS + "down/control?id=" + id)
    .then(function(response) {
      return response.json();
    }).then(function (cmd) {
      if(disconnected){
        console.log("connection found -> getting new id");
        fetchId();
      }
      execServerCommand(cmd);
    }).catch(function (err) {
      console.log("connection lost -> need new id");
      disconnected = true;
      currentLon = 0;
      currentLat = 0;
  });
}, 3000);


function prepBody(body){
  body.id = id;
  return JSON.stringify(body);
}

console.log(`'Allo 'Allo! Event Page for Browser Action`)
