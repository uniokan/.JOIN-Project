const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

const toDo = 'todo';
const inProgress = 'inprogress';
const awaitFeedback = 'feedback';
const done = 'done';
let allTasks = [];
let currentDraggedElement;
idCounter = 0;


async function init() {
    await getDataFromDatabaseByStart();
    checkLoginStatusAndRedirect();
    updateHTML();
}


async function getDataFromDatabaseByStart() {
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();

    pushCategoryInAllTasks('todo', responseToJson);
    pushCategoryInAllTasks('inprogress', responseToJson);
    pushCategoryInAllTasks('feedback', responseToJson);
}


function pushCategoryInAllTasks(category, responseToJson) {
    if (responseToJson[category]) {
        responseToJson[category].forEach(task => {
            task.id = idCounter++;
            allTasks.push(task);
        });
    }
}


async function getDataFromDatabase() {
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}


function updateHTML() {
    filterAllTasks(toDo);
    filterAllTasks(inProgress);
    filterAllTasks(awaitFeedback);
}


function filterAllTasks(task) {
    let container = document.getElementById(`${task}-container`);

    let category = allTasks.filter(c => c['step'] == `${task}`);

    container.innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        let element = category[i];
        container.innerHTML += gererateTaskHTML(element);
        // pushChangedTaskToDatabase(task,i);
    }
}


// async function pushChangedTaskToDatabase(task) {
//     await fetch(BASE_URL + "task/" + task['step'] + "/" + task.id + ".json", {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(task)
//     });
// }

function gererateTaskHTML(element) {
    return `
        <div class="task-smallview" draggable="true" ondragstart="startDragging(${element['id']})">
            <span class="task-smallview-title" id="category">${element['category']}</span>
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


function startDragging(id) {
    currentDraggedElement = id;
}


function allowDrop(event) {
    event.preventDefault();
}


function moveTo(category) {
    allTasks[currentDraggedElement]['step'] = category;
    updateHTML();
}


function openAddTask(){

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
    addTaskMain.style.margin=0;
    addTaskMain.style.padding='40px';
}

