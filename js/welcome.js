const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";
let todo = 0;
let urgentCounter = 0;
let done = 0;
let awaitingFeedback = 0;
let tasksInProgress = 0;
let tasks = [];
let taskBoardCounter = 0;
let tasksCounter = 0;


async function init() {
  await getTasksFromDatabase('todo');
  await getTasksFromDatabase('inprogress');
  await getTasksFromDatabase('feedback');
  checkLoginStatusAndRedirect();
  checkTime();
}


async function getTasksFromDatabase(category) {
  let response = await fetch(BASE_URL + "task/" + category + ".json");
  let responseToJson = await response.json();
  tasks.push(responseToJson);
  if (category == 'todo') { todo = tasks[tasksCounter].length }
  else if (category == 'inprogress') { tasksInProgress = tasks[tasksCounter].length }
  else if (category == 'feedback') { awaitingFeedback = tasks[tasksCounter].length }
  tasksCounter++;
  checkNumberOfUrgent();
  changeNumberOfTasks(category);
}


function checkNumberOfUrgent() {
  urgentCounter=0;

  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < tasks[i].length; j++) {
      if (tasks[i][j]['prio'] === 'urgent') {
        urgentCounter++;
      }
    }
  }
}


function changeNumberOfTasks(category) {
  let container = document.getElementById(`${category}-count`);
  let urgentCount = document.getElementById('urgent-count');
  let taskInBoardCounter = document.getElementById('count-task-board');

  writeNumberOfTasksToHTML(container, urgentCount, taskInBoardCounter, category);
}


function writeNumberOfTasksToHTML(container, urgentCount, taskInBoardCounter, category) {
  if (category === 'todo') {
    container.innerHTML = todo;
  }
  else if (category === 'feedback') {
    container.innerHTML = awaitingFeedback;
  }

  else if (category === 'inprogress') {
    container.innerHTML = tasksInProgress;
  }

  urgentCount.innerHTML = urgentCounter;
  taskBoardCounter = todo + done + awaitingFeedback + tasksInProgress;
  taskInBoardCounter.innerHTML = taskBoardCounter;
}


function checkTime() {
  let date = new Date();
  let hours = date.getHours();
  let container = document.getElementById('welcome-time-message');

  let message = 
  hours >= 6 && hours < 11 ? 'Good morning' :
  hours >= 11 && hours < 15 ? 'Good afternoon' :
  hours >= 15 && hours < 22 ? 'Good evening' :
  'Good night';

  container.innerHTML=message;
}
