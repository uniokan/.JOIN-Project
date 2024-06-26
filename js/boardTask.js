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
let assignedToInitialName = [];
let currentCategory;
let changeTaskForEditTask = false;
let clickedContainerCategory;


async function init() {
    await getDataFromDatabaseByStart();
    checkLoginStatusAndRedirect();
    updateHTML();
    getNameLocalStorage();
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
    if (html == "task-pop-up") {
        getTextForPopUp(key, html);
    }
}


function getTextForPopUp(key, html) {
    let getTitle = document.getElementById(`${key}-title`).innerText;
    let getDescription = allTasks[0][key]['description'];
    let getCategory = document.getElementById(`${key}-category`).innerText;
    let getPrio = allTasks[0][key]['prio'];
    let getAssignedto = document.getElementById(`${key}-assignedto`).innerHTML;
    let getDate = allTasks[0][key]['date'];
    let getSubtask = allTasks[0][key]['subtask'];
    let subtaskDiv = getSubtask != undefined ? getSubtask.map(sub => `<div>${sub}</div>`) : '';
    let subtaskLi = getSubtask != undefined ? getSubtask.map(sub => `<div class="new-subtask-added" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"><li>${sub}</li><div class="subtask-icons" id="subtask-icons"></div></div>`) : '';

    if (changeTaskForEditTask) {
        showCurrentValuesInEditPopUp(getTitle, getDescription, getDate, subtaskLi, html);
        changeTaskForEditTask = false;
    }
    else {
        showAsssignedPersonsInPopUp(getTitle, getDescription, getCategory, getPrio, getAssignedto, getDate, subtaskDiv)
    }

}

function showAsssignedPersonsInPopUp(getTitle, getDescription, getCategory, getPrio, getAssignedto, getDate, subtaskDiv) {
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

    currentCategory = document.getElementById('popup-category').innerText;
}

function showCurrentValuesInEditPopUp(title, description, date, subtaks, html) {
    document.getElementById('edited-title').value = title;
    document.getElementById('edited-description').value = description;
    document.getElementById('task-date-board').value = date;
    document.getElementById(`new-subtask-${html}`).innerHTML = subtaks;
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

function openAddTaskPopUp(category){
    clickedContainerCategory=category;
    openPopUp('add-pop-up'); 
    getContacts('addtask'); 
    getCurrentDate('addtask');
    activateMediumBtn('addtask');
    closePopUpOutsideContainer('add');
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


async function openEditTask(html) {
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.add('d-none');
    editTaskOpen = true;
    changeContentToEditPopUp();

    activateMediumBtn(html);
    clearContactArrays();
    await getContacts(html);
    getCurrentDate(html);
    getIdFromCheckboxAndChangeSrc(html);
    changeTaskForEditTask = true;
    getTextForPopUp(currentKey, html);
}


function changeContentToEditPopUp() {
    let standardContainer = document.getElementById('task-overlay-content');

    orginalContent = standardContainer.innerHTML;
    standardContainer.innerHTML = openEditTaskHTML();
}

function getIdFromCheckboxAndChangeSrc(html) {
    assignedToInitialName = [];
    let getAssignedto = allTasks[0][currentKey]['assignedTo']

    if (getAssignedto != undefined) {
        console.log(getAssignedto);

        getAssignedto.forEach(assigned =>
            assignedToInitialName.push({ 'name': assigned['name'], 'color': assigned['color'], 'fullname': assigned['fullname'], 'id': assigned.id })
        )

        console.log(assignedToInitialName);

        assignedToInitialName.forEach(element => {
            let getSelectedCheckbox = document.getElementById(element.id);
            getSelectedCheckbox.src = "./img/login_img/checkbox_icon_selected.svg";
            showSelectedInitials(element['color'], element['name'], html);
        })
    }
}


function clearContactArrays() {
    contacts = [];
    names = [];
    keys = [];
    nameColors = [];
}



async function getEditedText() {
    addTask = [];
    let title = document.getElementById('edited-title').value;
    let description = document.getElementById('edited-description').value;
    let date = document.getElementById('task-date-board').value;
    let prio = checkWichPrioSelected();
    let allAssignedContacts = allTasks[0][currentKey]['assignedTo'];
    getSubtasks();

    let taskDetails = safeEditedTaskDetails(title, description, date, prio, allAssignedContacts);
    addTask.push(taskDetails);
    console.log(addTask);
    await putToDatabase();
    closePopUp('task');
    location.reload()

}

function safeEditedTaskDetails(title, description, date, prio, allAssignedContacts) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtaskTexts,
        'category': currentCategory,
        'step': 'todo',
        'assignedTo': allAssignedContacts,
        'key': currentKey
    }
}

async function putToDatabase() {
    await fetch(BASE_URL + "task/" + currentKey + "/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(addTask[0])
    });
}

function searchTasks() {
    let query = document.getElementById('search-input').value.toLowerCase();
    let filteredTasks = allTasksJson.filter(task => 
        task.title.toLowerCase().includes(query) || task.category.toLowerCase().includes(query)
    );

    displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
    document.getElementById('todo-container').innerHTML = '';
    document.getElementById('inprogress-container').innerHTML = '';
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('done-container').innerHTML = '';

    filterTasksByCategory(filteredTasks, toDo, 'todo-container');
    filterTasksByCategory(filteredTasks, inProgress, 'inprogress-container');
    filterTasksByCategory(filteredTasks, awaitFeedback, 'feedback-container');
    filterTasksByCategory(filteredTasks, done, 'done-container');
}

function filterTasksByCategory(filteredTasks, category, containerId) {
    let container = document.getElementById(containerId);
    let categoryTasks = filteredTasks.filter(task => task.step === category);

    for (let i = 0; i < categoryTasks.length; i++) {
        let element = categoryTasks[i];
        container.innerHTML += gererateTaskHTML(element);
    }

    checkUserStoryOrTechnical();
}