$(document).ready(function() {
  console.log("jQuery sourced");

  eventListeners();
  getLists();

});

function eventListeners() {
  $('#newListButton').on('click',function() {
    console.log("newListButton clicked");
  });

  $('#newTaskButton').on('click',function() {
    console.log("newTaskButton clicked");
  });
}

function getLists() {
  $.ajax({
    type: "GET",
    url: "/lists",
    success: function(response) {
      console.log("Getting lists: ",response);
      $('#lists').empty();
      for (var i = 0; i < response.length; i++) {
        var list = response[i];
        $('#lists').append('<option data_id="' + list.list_id +
        '">' + list.list_name + '</option>');
      }
    }
  });

}
