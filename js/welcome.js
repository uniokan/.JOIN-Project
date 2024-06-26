const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";
let todo = 0;
let urgentCounter = 0;
let done = 0;
let awaitingFeedback = 0;
let tasksInProgress = 0;
let tasks = [];
let taskBoardCounter = 0;
let tasksCounter = 0;
let allTasksJson = []


async function init() {
  await getTasksFromDatabase();
  checkLoginStatusAndRedirect();
  checkTime();
  getNameLocalStorage();
}


async function getTasksFromDatabase() {

  let response = await fetch(BASE_URL + "task/" + ".json");
  let responseToJson = await response.json();
  tasks.push(responseToJson);

  generateJsonObjects();
  setNumberOfTasks();
  checkNumberOfUrgent();
  changeTask();
}


function changeTask(){
  changeNumberOfTasks('todo');
  changeNumberOfTasks('inprogress');
  changeNumberOfTasks('feedback');
  changeNumberOfTasks('done');
}


function generateJsonObjects() {
  tasks.forEach(taskGroup => {
    Object.values(taskGroup).forEach(jsonObject => {
      allTasksJson.push(jsonObject);
    });
  });
}


function setNumberOfTasks() {
  let filterTodo = allTasksJson.filter(c => c['step'] == `todo`);
  todo = filterTodo.length;

  let filterInprogress = allTasksJson.filter(c => c['step'] == 'inprogress');
  tasksInProgress = filterInprogress.length;

  let filterFeedback = allTasksJson.filter(c => c['step'] == 'feedback');
  awaitingFeedback = filterFeedback.length;

  let filterDone = allTasksJson.filter(c => c['step'] == 'done');
  done = filterDone.length;
}


function checkNumberOfUrgent() {

  let filterUrgents = allTasksJson.filter(c => c['prio'] == 'urgent');
  urgentCounter = filterUrgents.length;
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

  container.innerHTML = message;
}

function hideContainerWithFade() {
  let container = document.getElementById('userContainer');
  container.style.display = 'block';
  if (container) {
    setTimeout(function() {
      container.classList.add('fade-out');
      setTimeout(function() {
        container.style.display = 'none';
      }, 1000); 
    }, 1000);
  }
}

function checkAndHideContainer() {
  if (document.referrer.includes('index.html') && window.innerWidth <= 760) {
      hideContainerWithFade();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  checkAndHideContainer();
});