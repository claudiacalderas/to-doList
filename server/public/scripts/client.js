$(document).ready(function() {
  console.log("jQuery sourced");

  eventListeners();
  getLists();

});

function eventListeners() {

  // Add new list button on click
  $('#newListButton').on('click',function() {
    var newList = $('#newListInput').val();
    console.log("New list name:",newList);
    var objectToSend = {
      list_name: newList
    };
    console.log("Object to send is",objectToSend);
    if (newList !== "") {
      //ajax to create a new list
      $.ajax({
        type:"POST",
        url: "/lists/add",
        data: objectToSend,
        success: function(response) {
          getLists();
          $('#newListInput').val("");
        }
      });
    }
  }); // End of Add new list button on click

  // Delete list button on click
  $('#deleteListButton').on('click',function() {
    console.log("deleteListButton clicked");
    // get list selected
    var listname = $('#lists').val();
    var listId = $('#lists option:selected').attr('id');
    console.log('Delete List:', listname);
    console.log("List Id:",listId);
    $.ajax({
      type: 'DELETE',
      url: '/lists/delete/' + listId,
      success: function() {
        getLists();
      }
    });
  }); // End of Delete list button on click


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
        $('#lists').append('<option id="' + list.list_id +
        '">' + list.list_name + '</option>');
      }
    }
  });

}
