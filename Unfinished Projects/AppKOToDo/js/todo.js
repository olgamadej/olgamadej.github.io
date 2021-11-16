/* Module for To Do application */
var ToDoList = function(){

  /* add members here */
  var task = {
    name: ko.observable(),
    description: ko.observable(),
    priority: ko.observable()
  };

  var tasks = ko.observableArray();

  var addTask = function(){
    console.log("Adding a new task: " + task.name());
    tasks.push({name: task.name(),
        description: task.description(),
        priority: task.priority(),
        status: ko.observable('new')
    });
  };

  observableArray.sort(
  var sortByPriority = function(){
      console.log("Sorting tasks by priority");
        tasks.sort(
          function(left, right){
            return left.priority ==right.priority ?
            0
            :
            (left.priority < right.priority ? -1 : 1)
          });
    };
    var sortByName = function(){
      console.log("Sorting tasks by name");
      tasks.sort(
        function(left, right){
          return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
      });
    };
  );

  var clearTask = function(){
    task.name(null);
    task.description(null);
    task.priority("1"); /*po dodaniu priority clearTask przestało działać*/
  };

  var completeTask = function(task){
    console.log("Completing task with name: " + task.name);
    task.status('complete');
  };

  var deleteTask = function(task){
    console.log("Deleting task with name: " + task.name);
    tasks.remove(task);
  };

  var init = function(){
    /*add code to initialize this module */
    ko.applyBindings(ToDoList);
  };

  /* execute the init function when the DOM is ready */
  $(init);

  return {
    /*add members that will be exposed publicly */
    task: task,
    tasks: tasks,
    addTask: addTask,
    deleteTask: deleteTask,
    completeTask: completeTask,
    sortByPriority: sortByPriority
  };

}();
