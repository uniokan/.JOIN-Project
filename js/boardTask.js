// const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

const toDo = 'todo';
const inProgress = 'inprogress';
const awaitFeedback = 'feedback';
const done = 'done';
let allTasks = [];
let currentDraggedElement;
idCounter = 0;
let allKeys = [];
let allTasksJson = [];


async function init() {
    await getDataFromDatabaseByStart();
    checkLoginStatusAndRedirect();
    updateHTML();
}


async function getDataFromDatabaseByStart() {
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();

    allTasks.push(responseToJson);

    getKeys();
    generateJsonObjects();
}


function getKeys() {
    let keysArray = Object.keys(allTasks[0]);
    for (let i = 0; i < keysArray.length; i++) {
        allKeys.push(keysArray[i]);
    }
}


function updateHTML() {
    filterAllTasks(toDo);
    filterAllTasks(inProgress);
    filterAllTasks(awaitFeedback);
    filterAllTasks(done);
}


function generateJsonObjects() {
    allTasks.forEach(taskGroup => {
        Object.values(taskGroup).forEach(jsonObject => {
            allTasksJson.push(jsonObject);
        });
    });

    for (let i = 0; i < allKeys.length; i++) {
        allTasksJson[i]['key'] = allKeys[i];
    }
}


function filterAllTasks(step) {
    let container = document.getElementById(`${step}-container`);

    let category = allTasksJson.filter(c => c['step'] == `${step}`);


    container.innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        let element = category[i];
        container.innerHTML += gererateTaskHTML(element);
    }

    checkUserStoryOrTechnical();
}

function checkUserStoryOrTechnical() {
    let title = document.querySelectorAll('.task-smallview-title');

    title.forEach(titleText => {
        if (titleText.innerText == 'Technical Task') {
            titleText.style.backgroundColor = 'rgb(30, 214, 193)';
        }
    })
}


function gererateTaskHTML(element) {
    return `
        <div class="task-smallview" draggable="true" ondragstart="startDragging('${element['key']}')">
            <span class="task-smallview-title">${element['category']}</span>
            <h3 id="title">${element['title']}</h3>
            <span class="lightgray" id="description">${element['description']}</span>
            <span id="subtask">......... 1/2 Subtasks</span>
            <div class="space-between">
                <span id="name">AB</span>
                <img src="img/add_task_img/${element['prio']}.png">
            </div>
        </div>
            `
}


function startDragging(key) {
    currentDraggedElement = allTasksJson.findIndex(task => task.key === key);
}


function allowDrop(event) {
    event.preventDefault();
}


async function moveTo(category) {
    allTasksJson[currentDraggedElement]['step'] = category;
    let changedStep = allTasksJson[currentDraggedElement];
    let getKey = allTasksJson[currentDraggedElement]['key'];

    await pushChangedTaskToDatabase(changedStep, getKey);
    updateHTML();
}


async function pushChangedTaskToDatabase(task, key) {
    await fetch(BASE_URL + "task/" + key + "/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
}


function openAddTask() {

    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById('add-pop-up')
    let sidebar = document.getElementById('sidebar_addtask');
    let addTaskMain = document.querySelector('.add-task-main');

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    sidebar.classList.add('d-none');
    addTaskMain.style.margin = 0;
    addTaskMain.style.padding = '40px';
}

