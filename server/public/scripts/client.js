$(document).ready(function() {
  console.log("jQuery sourced");

  eventListeners();

  // var numberOfLists = $("#lists").children().length;
  // console.log("list has:", numberOfLists, "elements");
  // if(numberOfLists > 0){
    getLists();
  // }

});

var listId = "";

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
    // Shows modal window to confirm deletion
    getModalReady();
    // Get the modal
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
  }); // End of Delete list button on click


  // button "No" in modal window event listener
  $('#dontDelete').on('click',function() {
    // Get the modal
    var modal = document.getElementById('myModal');
    // Close the modal
    modal.style.display = "none";
  }); // End of button "No" in modal window event listener


  // button "Yes" in modal window event listener
  $('#goAhead').on('click',function() {
    console.log("Yes button clicked");
    // get list selected
    var listName = $('#lists').val();
    listId = $('#lists option:selected').attr('id');
    console.log('Delete List:', listName);
    console.log("List Id:",listId);
    // Delete tasks related to list
    $.ajax({
      type: 'DELETE',
      url: '/lists/deleteTasks/' + listId,
      success: function() {
        // Delete the list
        $.ajax({
          type: 'DELETE',
          url: '/lists/delete/' + listId,
          success: function() {
            getLists();
            console.log("Tasks deleted");
          }
        });
        listId = $('#lists option:selected').attr('id');
        getTasks(listId);
      }
    });
    // close modal window
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }); // End of button "Yes" in modal window event listener


  // Add new task Button
  $('#newTaskButton').on('click',function() {
    console.log("newTaskButton clicked");
    // get values from inputs
    var taskDescription = $('#newTaskDescription').val();
    var taskListId = parseInt($('#lists option:selected').attr('id'));
    var taskDone = false;
    var taskNotes = $('#newTaskNotes').val();
    var objectToSend = {
      task_description: taskDescription,
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
          $('#newTaskDueDate').val("");
          $('#newTaskNotes').val("");
        }
      });
    }
  }); // End of New Task Button on click


  // lists select on change event listener
  $('#lists').on('change', function() {
    console.log("option has changed");
    listId = $('#lists option:selected').attr('id');
    getTasks(listId);
  }); // end of lists select on change event listener


  // delete task button event listener
  $('#tasksDiv').on('click','#deleteTaskButton', function() {
    console.log("deleteTaskButton clicked");
    taskId = $(this).data('id');
    listId = $('#lists option:selected').attr('id');
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
    listId = $('#lists option:selected').attr('id');
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
      if(response.length > 0) {
        listId = $('#lists option:selected').attr('id');
        console.log(listId);
        getTasks(listId);
      }
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
        var doneTask = task.done;
        if(task.done){
          $el.append('<div id="left">'+
                      '<input type="checkbox" id="cboxDone" data-id=' +
                      task.task_id +' checked></div>');
        } else {
          $el.append('<div id="left">'+
                      '<input type="checkbox" id="cboxDone" data-id=' +
                      task.task_id +'></div>');
        }
        $el.append('<div id="middle"><span><b>' + task.task_description +
                    '</b></span><br><span>' + task.notes + '</span></div>');
        $el.append('<div id="right">'+
                    '<button id="deleteTaskButton" data-id='+
                    task.task_id+'>&times;</button></div>');
        // Sets different colors for done and undone tasks
        setTaskColor(doneTask,$el);
      }
    }
  });
} // end of getTasks() function

// Gets modal window that confirms list deletion ready
function getModalReady() {
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal window
  span.onclick = function() {
      modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal window, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  };
}

// Sets different colors for done and undone tasks
function setTaskColor(doneTask,element) {
  // changes color for done tasks
  if (doneTask) {
    element.removeClass('taskUndone');
    element.children().removeClass('taskUndone');
    element.addClass('taskDone');
    element.children().addClass('taskDone');
  } else {
    element.removeClass('taskDone');
    element.children().removeClass('taskDone');
    element.addClass('taskUndone');
    element.children().addClass('taskUndone');
  }
} // end of setTaskColor function
