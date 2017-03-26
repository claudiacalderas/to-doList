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

  // Add new task Button
  $('#newTaskButton').on('click',function() {
    console.log("newTaskButton clicked");
    // get values from inputs
    var taskDescription = $('#newTaskDescription').val();
    var taskPriority = $('#newTaskPriority').val();
    var taskListId = parseInt($('#lists option:selected').attr('id'));
    var taskDone = false;
    var taskNotes = $('#newTaskNotes').val();
    var objectToSend = {
      task_description: taskDescription,
      priority: taskPriority,
      list_id: taskListId,
      done: taskDone,
      notes: taskNotes
    };
    console.log(objectToSend);
    if (taskDescription !== "") {
      //ajax to create a new task
      $.ajax({
        type:"POST",
        url: "/tasks/add",
        data: objectToSend,
        success: function(response) {
          getTasks(taskListId);
          $('#newTaskDescription').val("");
          $('#newTaskPriority').val("");
          $('#newTaskDueDate').val("");
          $('#newTaskNotes').val("");
        }
      });
    }
  }); // End of New Task Button on click

  // lists select on change event listener
  $('#lists').on('change', function() {
    console.log("option has changed");
    var listId = $('#lists option:selected').attr('id');
    getTasks(listId);
  }); // end of lists select on change event listener

  // delete task button event listener
  $('#tasksDiv').on('click','#deleteTaskButton', function() {
    console.log("deleteTaskButton clicked");
    taskId = $(this).data('id');
    var listId = $('#lists option:selected').attr('id');
    console.log("Task id is:",taskId);
    $.ajax({
      type: 'DELETE',
      url: '/tasks/delete/' + taskId,
      success: function() {
        getTasks(listId);
      }
    });
  }); // end of delete task button event listener

  // checkbox event listener
  $('#tasksDiv').on('click','#cboxDone',function() {
    console.log("cboxDone clicked");
    taskId = $(this).data('id');
    if ($(this).is(":checked")) {
      completed = true;
    } else {
      completed = false;
    }
    console.log("Task id is:",taskId);
    console.log("task completed=",completed);
    var listId = $('#lists option:selected').attr('id');
    objectToSend = {
      done: completed
    };
    // update completion Status
    $.ajax({
      type: 'PUT',
      url: '/tasks/update/' + taskId,
      data: objectToSend,
      success: function() {
        getTasks(listId);
      }
    });
  }); // end of checkbox event listener

} // end of eventListeners() function


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
        if(task.done){
          $el.append('<div id="left">'+
                      '<input type="checkbox" id="cboxDone" data-id=' +
                      task.task_id +' checked></div>');
        } else {
          $el.append('<div id="left">'+
                      '<input type="checkbox" id="cboxDone" data-id=' +
                      task.task_id +'></div>');
        }
        $el.append('<div id="middle"><p><b>' + task.task_description +
                    '</b></p><p>' + task.notes + '</p></div>');
        $el.append('<div id="right">'+
                    '<button id="deleteTaskButton" data-id='+
                    task.task_id+'>X</button></div>');
      }
    }
  });
} // end of getTasks() function
