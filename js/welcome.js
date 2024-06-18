const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";
todo = 0;
urgentCounter = 0;
done = 0;
awaitingFeedback = 0;
tasksInProgress = 0;
tasks = [];
taskBoardCounter = 0;

async function getTasksFromDatabase() {
  let response = await fetch(BASE_URL + "task/todo" + ".json");
  let responseToJson = await response.json();
  tasks.push(responseToJson);
  todo = tasks[0].length;

  checkNumberOfUrgent();
  changeNumberOfTasks();
}


function checkNumberOfUrgent() {
  for (let i = 0; i < tasks[0].length; i++) {
    if (tasks[0][i]['prio'] === 'urgent') {
      urgentCounter++;
    }
  }
}

function changeNumberOfTasks() {
  let todoCount = document.getElementById('todo-count');
  let urgentCount = document.getElementById('urgent-count');
  let taskInBoardCounter = document.getElementById('count-task-board');

  todoCount.innerHTML = todo;
  urgentCount.innerHTML = urgentCounter;
  taskBoardCounter = todo + done + awaitingFeedback + tasksInProgress;
  taskInBoardCounter.innerHTML = taskBoardCounter;
}

