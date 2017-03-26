$(document).ready(function() {
  console.log("jQuery sourced");

  eventListeners();
  getLists();
  //getTasks();

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
    var listName = $('#lists').val();
    var listId = $('#lists option:selected').attr('id');
    console.log('Delete List:', listName);
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

  $('#lists').on('change', function() {
    console.log("option has changed");
    var listId = $('#lists option:selected').attr('id');
    getTasks(listId);
  });


}

// get lists defined by user
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
      var listId = $('#lists option:selected').attr('id');
      getTasks(listId);
    }
  });
} // end of getLists() function

// gets tasks for selected list
function  getTasks(id) {
  // get list selected
  console.log("getting tasks for list:",id);
  $.ajax({
    type: "GET",
    url: "/tasks/" + id,
    success: function(response) {
      console.log("Getting lists: ",response);
      $('#tasksDiv').empty();
      for (var i = 0; i < response.length; i++) {
        var task = response[i];
        $('#tasksDiv').append('<div class="taskBlock" id="' + task.task_id + '"></div>');

        var $el = $('#tasksDiv').children().last();
        $el.append('<div id="left"><p><b>' + task.task_description +
                    '</b></p><p>' + task.notes + '</p></div>');
        $el.append('<div id="right"><button id="deleteTaskButton" data_id='+
                    task.task_id+'>X</button></div>');


      }
    }
  });
} // end of getTasks() function
