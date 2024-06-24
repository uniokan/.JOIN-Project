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
let assignedToJson = [];


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
    let reducedText = '';
    let assignedToHTML = '';

    if (element['assignedTo'] != null) {
        assignedToHTML = generateAssignedToHTML(element);
    }

    if (element['description'] != null) {
        reducedText = reducedDescriptionText(element);
    }

    return `
         <div onclick="openPopUp('task-closeup', '${element['key']}')" class="task-smallview" draggable="true" ondragstart="startDragging('${element['key']}')">
             <span id="${element['key']}-category" class="task-smallview-title">${element['category']}</span>
             <h3 id="${element['key']}-title" class="smallview-title">${element['title']}</h3>
             <div class="lightgray smallview-description" id="${element['key']}-description">${reducedText}</div>
             <span id="${element['key']}-subtask">......... 1/2 Subtasks</span>
             <div class="space-between ml8">
                 <div id="${element['key']}-assignedto" class="board-assignetTo-container" name="${element['fullname']}">
                     ${assignedToHTML}
                 </div>
                 <img id="${element['key']}-prio" src="img/add_task_img/${element['prio']}.png">
             </div>
         </div>
     `;
}


function reducedDescriptionText(element) {
    let getText = element['description'];
    let maxLength = 50;

    if (getText.length <= maxLength) {
        return getText;
    }

    else if (getText.length >= maxLength) {
        return getText.slice(0, maxLength) + '...'
    }
}


function generateAssignedToHTML(element) {
    let assignedToHTML = '';
    let assignedPeople = element['assignedTo'].slice(0, 3);

    assignedPeople.forEach(person => {
        let initials = getFirstAndLastInitials(person['fullname']);
        let fullName = person['fullname']
        assignedToHTML += `
        <div class="assigned-person">
            <div class="circle ml-16" style="background-color: ${person['color']};"><span>${initials}</div>
            <div class="n d-none"> ${fullName} </div>
        </div>
        `;
    });

    return assignedToHTML;
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


function openPopUp(html, key) {

    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${html}`)
    let sidebar = document.getElementById('sidebar_addtask');
    let addTaskMain = document.querySelector('.add-task-main');

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    sidebar.classList.add('d-none');
    addTaskMain.style.margin = 0;
    addTaskMain.style.padding = '40px';

    getTextForPopUp(key);
}

function getTextForPopUp(key) {
    let getTitle = document.getElementById(`${key}-title`).innerText;
    let getDescription = document.getElementById(`${key}-description`).innerText;
    let getCategory = document.getElementById(`${key}-category`).innerText;
    let getSubtask = document.getElementById(`${key}-title`).innerText;
    let getPrio = document.getElementById(`${key}-prio`).innerText;
    let getAssignedto = document.getElementById(`${key}-assignedto`).innerHTML;

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = getAssignedto;

    let assignedtoFullNames = Array.from(tempDiv.querySelectorAll('.assigned-person .n'));
    assignedtoFullNames.forEach(div => div.classList.remove('d-none'));
    let assignedtoFullNamesHTML = assignedtoFullNames.map(div => div.outerHTML).join('');

    showCurrentInfoInPopUp(getTitle, getDescription, getCategory, getSubtask, getPrio, assignedtoFullNamesHTML);
}

function showCurrentInfoInPopUp(title, description, category, subtask, prio, assignedto) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-description').innerHTML = description;
    document.getElementById('popup-category').innerHTML = category;
    document.getElementById('popup-subtask').innerHTML = subtask;
    document.getElementById('popup-prio').innerHTML = prio;
    document.getElementById('popup-assignedto').innerHTML = assignedto;
}

