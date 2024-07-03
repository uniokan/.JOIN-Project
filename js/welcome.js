let todo = 0;
let urgentCounter = 0;
let done = 0;
let awaitingFeedback = 0;
let tasksInProgress = 0;
let tasks = [];
let taskBoardCounter = 0;
let tasksCounter = 0;
let allTasksJson = []


/**
 * Initializes the application by fetching tasks from the database, checking login status, 
 * checking the current time, and retrieving the user's name from local storage.
 */
async function init() {
  await getTasksFromDatabase();
  checkLoginStatusAndRedirect();
  checkTime();
  getNameLocalStorage();
}


/**
 * Fetches tasks from the database, processes the tasks, and updates the UI accordingly.
 */
async function getTasksFromDatabase() {
  let response = await fetch(BASE_URL + "task/" + ".json");
  let responseToJson = await response.json();
  tasks.push(responseToJson);

  generateJsonObjects();
  setNumberOfTasks();
  checkNumberOfUrgent();
  changeTask();
}


/**
 * Updates the task counters for different categories.
 */
function changeTask(){
  changeNumberOfTasks('todo');
  changeNumberOfTasks('inprogress');
  changeNumberOfTasks('feedback');
  changeNumberOfTasks('done');
}


/**
 * Generates JSON objects for each task and stores them in the allTasksJson array.
 */
function generateJsonObjects() {
  tasks.forEach(taskGroup => {
    Object.values(taskGroup).forEach(jsonObject => {
      allTasksJson.push(jsonObject);
    });
  });
}


/**
 * Sets the number of tasks for each category (todo, inprogress, feedback, done).
 */
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


/**
 * Checks the number of urgent tasks and updates the urgentCounter.
 */
function checkNumberOfUrgent() {
  let filterUrgents = allTasksJson.filter(c => c['prio'] == 'urgent');
  urgentCounter = filterUrgents.length;
}


/**
 * Updates the number of tasks displayed in the UI for a given category.
 * 
 * @param {string} category - The category of tasks to update (todo, inprogress, feedback, done).
 */
function changeNumberOfTasks(category) {
  let container = document.getElementById(`${category}-count`);
  let urgentCount = document.getElementById('urgent-count');
  let taskInBoardCounter = document.getElementById('count-task-board');

  writeNumberOfTasksToHTML(container, urgentCount, taskInBoardCounter, category);
}


/**
 * Writes the number of tasks to the HTML elements.
 * 
 * @param {HTMLElement} container - The HTML element for the task count.
 * @param {HTMLElement} urgentCount - The HTML element for the urgent task count.
 * @param {HTMLElement} taskInBoardCounter - The HTML element for the task board counter.
 * @param {string} category - The category of tasks to update (todo, inprogress, feedback, done).
 */
function writeNumberOfTasksToHTML(container, urgentCount, taskInBoardCounter, category) {
  if (category === 'todo') {
    container.innerHTML = todo;
  } else if (category === 'feedback') {
    container.innerHTML = awaitingFeedback;
  } else if (category === 'inprogress') {
    container.innerHTML = tasksInProgress;
  }

  urgentCount.innerHTML = urgentCounter;
  taskBoardCounter = todo + done + awaitingFeedback + tasksInProgress;
  taskInBoardCounter.innerHTML = taskBoardCounter;
}


/**
 * Checks the current time and updates the greeting message based on the time of day.
 */
function checkTime() {
  let date = new Date();
  let hours = date.getHours();
  let container = document.getElementById('welcome-time-message');
  let container2 = document.getElementById('welcome-time-message-2');

  let message =
    hours >= 6 && hours < 11 ? 'Good morning' :
      hours >= 11 && hours < 15 ? 'Good afternoon' :
        hours >= 15 && hours < 22 ? 'Good evening' :
          'Good night';

  container.innerHTML = message;
  container2.innerHTML = message;
}


/**
 * Hides the container element with a fade-out effect.
 */
function hideContainerWithFade() {
  let container = document.getElementById('userContainer');
  container.style.display = 'flex';
  if (container) {
    setTimeout(function() {
      container.classList.add('fade-out');
      setTimeout(function() {
        container.style.display = 'none';
      }, 1000); 
    }, 1000);
  }
}


/**
 * Checks if the container should be hidden based on the referrer and window width.
 */
function checkAndHideContainer() {
  if (document.referrer.includes('index.html') && window.innerWidth <= 760) {
    hideContainerWithFade();
  }
}


/**
 * Adds an event listener to the DOMContentLoaded event to check and hide the container.
 */
document.addEventListener('DOMContentLoaded', function() {
  checkAndHideContainer();
});


/**
 * Navigates to the 'board.html' page when a div is clicked.
 * @param {HTMLElement} element - The HTML element that was clicked (should be a <div>).
 */
function navigateToBoard(element) {
  openSite('board.html', 'board-link')
}


function openSite(link, id) {
  localStorage.setItem('changeBgColor', id);
  window.location.href = link;
}

document.addEventListener('DOMContentLoaded', function () {
  let idToChangeBg = localStorage.getItem('changeBgColor');
  let anchor = document.getElementById(idToChangeBg);
  if (anchor) {
    anchor.style.backgroundColor = "#091931";
    localStorage.removeItem('changeBgColor');
}
});