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
let currentKey;
let editTaskOpen = false;
let orginalContent;


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


function startDragging(key) {
    currentDraggedElement = allTasksJson.findIndex(task => task.key === key);
    rotateTask(key);
}

function rotateTask(key) {
    let getTask = document.getElementById(key.toString());
    getTask.classList.add('rotate');
}

function removeRotation(key) {
    let getTask = document.getElementById(key.toString());
    getTask.classList.remove('rotate');
    console.log('haha');
}

function allowDrop(event) {
    event.preventDefault();
}


async function moveTo(category) {
    allTasksJson[currentDraggedElement]['step'] = category;
    let changedStep = allTasksJson[currentDraggedElement];
    let getKey = allTasksJson[currentDraggedElement]['key'];

    let container = document.getElementById(`${category}-container`);
    container.classList.remove('container-highlight');

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

    currentKey = key;

    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${html}`);
    // let sidebar = document.getElementById('sidebar_addtask');
    // let addTaskMain = document.querySelector('.add-task-main');

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    // sidebar.classList.add('d-none');
    // addTaskMain.style.margin = 0;
    // addTaskMain.style.padding = '40px';


    getTextForPopUp(key);
}


function getTextForPopUp(key) {
    let getTitle = document.getElementById(`${key}-title`).innerText;
    let getDescription = allTasks[0][key]['description'];
    let getCategory = document.getElementById(`${key}-category`).innerText;
    let getPrio = allTasks[0][key]['prio'];
    let getAssignedto = document.getElementById(`${key}-assignedto`).innerHTML;
    let getDate = allTasks[0][key]['date'];
    let getSubtask = allTasks[0][key]['subtask'];
    let subtaskDiv = getSubtask.map(sub => `<div>${sub}</div>`)

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = getAssignedto;

    let assignedtoFullNames = tempDiv.querySelectorAll('.assigned-person .d-none');
    assignedtoFullNames.forEach(div => div.classList.remove('d-none'));
    let assignedtoHTML = Array.from(tempDiv.querySelectorAll('.assigned-person')).map(div => div.innerHTML).join('');

    showCurrentInfoInPopUp(getTitle, getDescription, getCategory, subtaskDiv, getPrio, assignedtoHTML, getDate);
}


function showCurrentInfoInPopUp(title, description, category, subtask, prio, assignedto, date) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-description').innerHTML = description;
    document.getElementById('popup-category').innerHTML = category;
    document.getElementById('popup-subtask').innerHTML = subtask;
    document.getElementById('popup-prio').innerHTML = prio.charAt(0).toUpperCase() + prio.slice(1).toLowerCase();
    document.getElementById('popup-assignedto').innerHTML = assignedto;
    document.getElementById('popup-date').innerHTML = date;
}


function closePopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.add('d-none');
    backgroundDim.classList.remove('background-dim');
    addTaskPopUp.classList.remove('pop-up-100vh');
    addTaskPopUp.classList.add('pop-up-hidden');

    if (editTaskOpen) {
        changeEditTaskToStandardText();
        false;
    }
}


function closePopUpOutsideContainer(select) {

    let backgroundDim = document.getElementById('background-dim');
    let popUp = document.getElementById('add-task-pop-up');

    backgroundDim.addEventListener('click', event => {
        if (!popUp.contains(event.target)) {
            closePopUp(select);
            if (editTaskOpen) {
                changeEditTaskToStandardText();
                false;
            }
        }
    });

    backgroundDim.addEventListener('mousemove', event => {
        if (popUp.contains(event.target)) {
            backgroundDim.style.cursor = 'unset';
        }

        else {
            backgroundDim.style.cursor = 'pointer';
        }
    });

    popUp.addEventListener('click', event => {
        event.stopPropagation();
    });
}



async function deleteTask(container) {
    await fetch(BASE_URL + "task/" + currentKey + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    let element = document.getElementById(currentKey);
    closePopUp(container);
    element.remove();
}


function highlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.add('container-highlight');
}


function stopHighlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.remove('container-highlight');
}


function changeEditTaskToStandardText() {
    let standardContainer = document.getElementById('task-overlay-content');
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.remove('d-none');
    standardContainer.innerHTML = orginalContent;
}


async function openEditTask() {
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.add('d-none');
    editTaskOpen = true;
    changeContentToEditPopUp();

    activateMediumBtn();
    clearContactArrays();
    await getContacts();
    getCurrentDate();
    getIdFromCheckboxAndChangeSrc();
    
}


function changeContentToEditPopUp() {
    let standardContainer = document.getElementById('task-overlay-content');

    orginalContent = standardContainer.innerHTML;
    standardContainer.innerHTML = openEditTaskHTML();
}

function getIdFromCheckboxAndChangeSrc(){
    let assignedToInitialName = [];

    console.log(allTasks[0][currentKey]['assignedTo']);
    let currentAssignedto = (allTasks[0][currentKey]['assignedTo']);

    currentAssignedto.forEach(assigned =>
        assignedToInitialName.push({ 'name': assigned['name'], 'color': assigned['color'] })
    )

    console.log(assignedToInitialName);

    assignedToInitialName.forEach(element => {
        let createId = element['color'] + '-' + element['name']
        console.log(createId);
        let getSelectedCheckbox= document.getElementById(`${createId}`);
        getSelectedCheckbox.src="./img/login_img/checkbox_icon_selected.svg";
        showSelectedInitials(element['color'],element['name']);
    })
}


function clearContactArrays() {
    contacts = [];
    names = [];
    keys = [];
    nameColors = [];
}


function getEditedText() {
    let title = document.getElementById('edited-title');
    let description = document.getElementById('edited-description');
    let date = document.getElementById('edited-date');
}