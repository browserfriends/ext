console.log(`'Allo 'Allo! New Tab`);


browser.runtime.sendMessage({"intent": 'getId'}).then(function (response) {
  console.log(response);

  fetch(response.api + "friends?id=" + response.id)
    .then(function(response) {
      return response.json();
    }).then(function (friends) {
      document.getElementById('friendsList').innerHTML = "";
      for(var i = 0; i < friends.ids.length; i++) {
        console.log(friends.ids[i]);
        console.log(friends.acts[i]);
        var ul = document.getElementById("friendsList");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("Someone is " + friends.ids[i][1] + "m away from you. They last " + friends.acts[i]));
        ul.appendChild(li);
      }

  });
});
