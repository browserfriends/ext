console.log(`'Allo 'Allo! New Tab`);


browser.runtime.sendMessage({"intent": 'getId'}).then(function (response) {
  console.log(response);

  fetch(response.api + "friends?id=" + response.id)
    .then(function(response) {
      return response.json();
    }).then(function (friends) {
      var inner = "";
      var ul = document.getElementById("friendsList");
      for(var i = 0; i < friends.ids.length; i++) {

      inner += makeCard("<img src='https://maps.googleapis.com/maps/api/staticmap?zoom=18&size=300x150&maptype=roadmap\n" +
        "&markers=color:blue%7Clabel:S%7C" + friends.coords[i][0] + "," + friends.coords[i][1] +
        "&key=AIzaSyAMKNkuj3va5nL4RSsutcFdsFl_zTiqJ88' />", friends.acts[i], friends.ids[i][1]);
      }
     ul.innerHTML = inner;

  });
});


function makeCard(img, link, dist) {
  return "<div class=\"card\" style=\"width: 18rem; margin: 10px;\">\n" +
    img +
    "  <div class=\"card-body\">\n" +
    "    <h5 class=\"card-title\">A friend!</h5>\n" +
    "    <p class=\"card-text\">They are " + dist + " meters away </p>\n" +
    "    <a href=\"" + link + "\" class=\"btn btn-primary\"><strike>Stalk</strike> bond</a>\n" +
    "  </div>\n" +
    "</div>"
}
