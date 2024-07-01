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
let subtaskNumber = 0;
let completedTasks = 0;
let stepCounters = {
    'todo': 0,
    'inprogress': 0,
    'feedback': 0,
    'done': 0
};


/**
 * Initializes the application by fetching data, updating HTML, and checking various statuses.
 */
async function init() {
    await getDataFromDatabaseByStart(); // Fetch initial data from database
    checkLoginStatusAndRedirect(); // Check login status and possibly redirect
    updateHTML(); // Update HTML elements based on fetched data
    getNameLocalStorage(); // Retrieve name from local storage
    checkProgressBar(); // Update progress bar based on current tasks
}


/**
 * Retrieves data from the database and initializes necessary data structures.
 */
async function getDataFromDatabaseByStart() {
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();

    allTasks.push(responseToJson); // Store fetched data in allTasks array

    getKeys(); // Extract keys from fetched data
    generateJsonObjects(); // Generate JSON objects based on fetched data
}


/**
 * Extracts keys from the first set of tasks and stores them in allKeys array.
 */
function getKeys() {
    let keysArray = Object.keys(allTasks[0]);
    for (let i = 0; i < keysArray.length; i++) {
        allKeys.push(keysArray[i]); // Populate allKeys array with extracted keys
    }
}


/**
 * Updates the HTML view based on current data.
 */
function updateHTML() {
    filterAllTasks(toDo); // Filter tasks for 'To Do' section
    filterAllTasks(inProgress); // Filter tasks for 'In Progress' section
    filterAllTasks(awaitFeedback); // Filter tasks for 'Awaiting Feedback' section
    filterAllTasks(done); // Filter tasks for 'Done' section
}


/**
 * Generates JSON objects based on allTasks array and associates keys with tasks.
 */
function generateJsonObjects() {
    allTasks.forEach(taskGroup => {
        Object.values(taskGroup).forEach(jsonObject => {
            allTasksJson.push(jsonObject); // Push each task object to allTasksJson array
        });
    });

    for (let i = 0; i < allKeys.length; i++) {
        allTasksJson[i]['key'] = allKeys[i]; // Assign keys to corresponding task objects
    }
}


/**
 * Filters tasks based on the given step and updates the corresponding HTML container.
 * @param {string} step - The step (e.g., 'To Do', 'In Progress') to filter tasks for.
 */
function filterAllTasks(step) {
    let container = document.getElementById(`${step}-container`);

    let category = allTasksJson.filter(c => c['step'] == `${step}`);

    container.innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        let element = category[i];
        let totalSubtask = element['subtask'];
        container.innerHTML += gererateTaskHTML(element, totalSubtask); // Generate HTML for each task in the category
    }

    checkUserStoryOrTechnical(); // Check if any tasks have 'Technical Task' title
    checkLengthOfStepContainer(category, step); // Check and update container length based on tasks
}


/**
 * Checks the length of the task container for a given step and updates if empty.
 * @param {Array} category - The array of tasks for the specified step.
 * @param {string} step - The step (e.g., 'To Do', 'In Progress') to check length for.
 */
function checkLengthOfStepContainer(category, step) {
    stepCounters[`${step}`] = category.length;

    if (stepCounters[`${step}`] <= 0) {
        document.getElementById(`${step}-container`).innerHTML = `<div class="step-container-null-content"> No Tasks ${step} </div>`;
    }
}


/**
 * Checks if any task has the title 'Technical Task' and applies a specific background color.
 */
function checkUserStoryOrTechnical() {
    let title = document.querySelectorAll('.task-smallview-title');

    title.forEach(titleText => {
        if (titleText.innerText == 'Technical Task') {
            titleText.style.backgroundColor = 'rgb(30, 214, 193)';
        }
    })
}


/**
 * Reduces the length of task description to a maximum of 50 characters.
 * @param {Object} element - The task object containing description to be reduced.
 * @returns {string} - The truncated or original task description.
 */
function reducedDescriptionText(element) {
    let getText = element['description'];
    let maxLength = 50;

    if (getText.length <= maxLength) {
        return getText;
    } else {
        return getText.slice(0, maxLength) + '...'; // Truncate description if longer than maxLength
    }
}


/**
 * Initiates dragging of a task element identified by its key.
 * @param {string} key - The unique key of the task element being dragged.
 */
function startDragging(key) {
    currentDraggedElement = allTasksJson.findIndex(task => task.key === key); // Find index of task in allTasksJson array
    rotateTask(key); // Rotate the task element being dragged
}


/**
 * Adds rotation effect to the task element identified by its key.
 * @param {string} key - The unique key of the task element to rotate.
 */
function rotateTask(key) {
    let getTask = document.getElementById(key.toString());
    getTask.classList.add('rotate'); // Apply rotation CSS class to the task element
}


/**
 * Removes rotation effect from the task element identified by its key.
 * @param {string} key - The unique key of the task element to stop rotating.
 */
function removeRotation(key) {
    let getTask = document.getElementById(key.toString());
    getTask.classList.remove('rotate'); // Remove rotation CSS class from the task element
}


/**
 * Allows dropping of a dragged task element.
 * @param {Event} event - The event object representing the drop action.
 */
function allowDrop(event) {
    event.preventDefault(); // Prevent default behavior of the drop action
}


/**
 * Moves the currently dragged task to a new category and updates the database and HTML view.
 * @param {string} category - The target category to move the task to ('To Do', 'In Progress', etc.).
 */
async function moveTo(category) {
    allTasksJson[currentDraggedElement]['step'] = category; // Update step of dragged task
    let changedStep = allTasksJson[currentDraggedElement];
    let getKey = allTasksJson[currentDraggedElement]['key'];

    let container = document.getElementById(`${category}-container`);
    container.classList.remove('container-highlight'); // Remove highlighting from target container

    await pushChangedTaskToDatabase(changedStep, getKey); // Push updated task to database
    updateHTML(); // Update HTML view with new task arrangement
    checkProgressBar(); // Update progress bar after task movement
}


/**
 * Updates the database with the changed task information.
 * @param {Object} task - The task object containing updated information.
 * @param {string} key - The unique key of the task being updated.
 */
async function pushChangedTaskToDatabase(task, key) {
    await fetch(BASE_URL + "task/" + key + "/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task) // Update task in database with new information
    });
}


/**
 * Opens a popup window for viewing or editing task details.
 * @param {string} html - The HTML ID of the popup content to display.
 * @param {string} key - The unique key of the task to display in the popup.
 */
function openPopUp(html, key) {
    currentKey = key;

    document.body.style.overflowY = 'hidden';
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${html}`);

    content.classList.remove('d-none'); // Remove 'hidden' class to show popup content
    backgroundDim.classList.add('background-dim'); // Dim background for popup focus
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh'); // Show popup window

    if (html == "task-pop-up") {
        getTextForPopUp(key, html); // Fetch and display task details in the popup
    }
}


/**
 * Retrieves and displays text for a popup based on provided key and HTML.
 * @param {string} key - The identifier key for the task.
 * @param {string} html - HTML content.
 */
function getTextForPopUp(key, html) {
    let getTitle = document.getElementById(`${key}-title`).innerText;
    let getDescription = allTasks[0][key]['description'];
    let getCategory = document.getElementById(`${key}-category`).innerText;
    let getPrio = allTasks[0][key]['prio'];
    let getAssignedto = assignedToAllContactsHTML(key);
    let getDate = allTasks[0][key]['date'];
    let getSubtask = allTasks[0][key]['subtask'];
    let subtaskDiv = getSubtask != undefined ? getSubtask.map((sub, index) => `<div class="subtask-checkbox"><img id="checkbox${index}"  onclick="toggleCheckBoxForSubtask(this, ${index})" src="./img/login_img/checkbox_icon.svg" style="width: 24px; height: 24px;">  <span> ${sub['name']} </span>  </div>`).join('') : '';
    let subtaskLi = getSubtask != undefined ? getSubtask.map(sub => `<div class="new-subtask-added" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"><li>${sub['name']}</li><div class="subtask-icons" id="subtask-icons"></div></div>`).join('') : '';
    
    if (changeTaskForEditTask) {
        showCurrentValuesInEditPopUp(getTitle, getDescription, getDate, subtaskLi, html);
        changeTaskForEditTask = false;
    }
    else {
        showCurrentInfoInPopUp(getTitle, getDescription, getCategory, subtaskDiv, getPrio, getAssignedto, getDate )
    }

    
    setCheckboxIcons();
    changeColorOfCategoryEditTask(getCategory);
}


/**
 * Changes the background color of the category container in the edit task popup.
 * @param {string} category - The category type ('User Story' or 'Technical Task').
 */
function changeColorOfCategoryEditTask(category) {
    let getContainer = document.getElementById('popup-category');

    category == 'User Story' ? getContainer.style.backgroundColor = '#0037ff' : '';
    category == 'Technical Task' ? getContainer.style.backgroundColor = 'rgb(30,214,193)' : '';
}


/**
 * Displays current task information in the popup.
 * @param {string} title - Title of the task.
 * @param {string} description - Description of the task.
 * @param {string} category - Category of the task.
 * @param {string} subtask - HTML content for subtasks.
 * @param {string} prio - Priority of the task.
 * @param {string} assignedto - Assigned persons' information.
 * @param {string} date - Date of the task.
 */
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


/**
 * Displays current values in the edit popup for editing.
 * @param {string} title - Title of the task.
 * @param {string} description - Description of the task.
 * @param {string} date - Date of the task.
 * @param {string} subtaks - HTML content for subtasks.
 * @param {string} html - HTML content.
 */
function showCurrentValuesInEditPopUp(title, description, date, subtaks, html) {
    document.getElementById('edited-title').value = title;
    document.getElementById('edited-description').value = description;
    document.getElementById('task-date-board').value = date;
    document.getElementById(`new-subtask-${html}`).innerHTML = subtaks;
}


/**
 * Closes a popup and resets its state.
 * @param {string} select - Identifier for the popup to be closed.
 */
function closePopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${select}-pop-up`)
    document.body.style.overflowY = 'unset';

    content.classList.add('d-none');
    backgroundDim.classList.remove('background-dim');
    addTaskPopUp.classList.remove('pop-up-100vh');
    addTaskPopUp.classList.add('pop-up-hidden');

    if (editTaskOpen) {
        changeEditTaskToStandardText();
        false;
    }
}


/**
 * Opens the add task popup and initializes necessary components.
 * @param {string} category - Category of the task to be added.
 */
function openAddTaskPopUp(category) {
    clickedContainerCategory = category;

    if (window.matchMedia("(max-width: 500px)").matches) {
        window.location.href="add_task.html";
    }

    else{
    
    openPopUp('add-pop-up');
    getContacts('addtask');
    getCurrentDate('addtask');
    activateMediumBtn('addtask');
    closePopUpOutsideContainer('add');
    }
}


/**
 * Closes a popup when clicked outside of its container.
 * @param {string} select - Identifier for the popup to be closed.
 */
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


/**
 * Asynchronously deletes a task via a fetch request and handles popup closure.
 * @param {string} container - Identifier for the container related to the task.
 */
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


/**
 * Highlights the specified container by adding a CSS class.
 * @param {string} containerId - The ID of the container element to highlight.
 */
function highlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.add('container-highlight');
}


/**
 * Stops highlighting the specified container by removing a CSS class.
 * @param {string} containerId - The ID of the container element to stop highlighting.
 */
function stopHighlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.remove('container-highlight');
}


/**
 * Changes the task overlay content from edit mode to standard text mode.
 */
function changeEditTaskToStandardText() {
    let standardContainer = document.getElementById('task-overlay-content');
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.remove('d-none');
    standardContainer.innerHTML = orginalContent;
}


/**
 * Opens the edit task popup asynchronously and performs several tasks like activating buttons, fetching contacts, etc.
 * @param {HTMLElement} html - The HTML element used in the operation.
 */
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


/**
 * Changes the content of the task overlay to the edit popup mode.
 */
function changeContentToEditPopUp() {
    let standardContainer = document.getElementById('task-overlay-content');

    orginalContent = standardContainer.innerHTML;
    standardContainer.innerHTML = openEditTaskHTML();
}


/**
 * Retrieves IDs from checkboxes and changes their source URLs.
 * @param {HTMLElement} html - The HTML element used in the operation.
 */
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


/**
 * Clears arrays used for storing contacts.
 */
function clearContactArrays() {
    contacts = [];
    names = [];
    keys = [];
    nameColors = [];
}


/**
 * Retrieves edited text input values and prepares them for saving.
 */
async function getEditedText() {
    addTask = [];
    let title = document.getElementById('edited-title').value;
    let description = document.getElementById('edited-description').value;
    let date = document.getElementById('task-date-board').value;
    let prio = checkWichPrioSelected();
    let allAssignedContacts = allTasks[0][currentKey]['assignedTo'];
    let step = allTasks[0][currentKey]['step'];

    getSubtasks();

    let taskDetails = safeEditedTaskDetails(title, description, date, prio, allAssignedContacts, step);
    addTask.push(taskDetails);
    console.log(addTask);
    await putToDatabase();
    closePopUp('task');
    location.reload()

}


/**
 * Safely constructs edited task details object.
 * @param {string} title - The edited task title.
 * @param {string} description - The edited task description.
 * @param {string} date - The edited task date.
 * @param {string} prio - The edited task priority.
 * @param {array} allAssignedContacts - The edited task assigned contacts.
 * @param {string} step - The edited task step.
 * @returns {object} - Object containing edited task details.
 */
function safeEditedTaskDetails(title, description, date, prio, allAssignedContacts, step) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtaskTexts,
        'category': currentCategory,
        'step': step,
        'assignedTo': allAssignedContacts,
        'key': currentKey
    }
}


/**
 * Sends edited task details to the database.
 */
async function putToDatabase() {
    await fetch(BASE_URL + "task/" + currentKey + "/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(addTask[0])
    });
}


/**
 * Searches tasks based on user input and filters them accordingly.
 */
function searchTasks() {
    let query = document.getElementById('search-input').value.trim().toLowerCase();

    if (query === '') {
        updateHTML();
        checkProgressBar();
        return;
    }

    let filteredTasks = allTasksJson.filter(task =>
        task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
    );

    displayFilteredTasks(filteredTasks);
} 


/**
 * Displays filtered tasks in respective containers based on their categories.
 * @param {array} filteredTasks - Array of tasks filtered based on search query.
 */
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


/**
 * Filters tasks by category and updates the corresponding container.
 * @param {array} filteredTasks - Array of tasks filtered based on search query.
 * @param {string} category - Category of tasks to filter.
 * @param {string} containerId - ID of the container to update.
 */
function filterTasksByCategory(filteredTasks, category, containerId) {
    let container = document.getElementById(containerId);
    let categoryTasks = filteredTasks.filter(task => task.step === category);

    for (let i = 0; i < categoryTasks.length; i++) {
        let element = categoryTasks[i];
        container.innerHTML += gererateTaskHTML(element);
        updateProgressBar();
    }

    checkUserStoryOrTechnical();
 
}


/**
 * Checks the progress bar for each key based on completed subtasks.
 */
function checkProgressBar() {
    allKeys.forEach(key => {
        let completedTasks = 0;
        const tasks = allTasks[0][key]['subtask'];

        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                if (task['status']) {
                    completedTasks++;
                }
            });

            subtasksLengthIsHigherThenNull(tasks, key, completedTasks);
        }

        else {
            subtaskLengthIsNull(key, completedTasks);
        }
    });
}


/**
 * Handles the case when subtask length is null.
 * @param {string} key - The key identifying the task.
 * @param {number} completedTasks - Number of completed tasks.
 */
function subtaskLengthIsNull(key, completedTasks) {
    const totalTasks = 0; // This should probably be dynamically set based on your context
    let progress = 0;

    if (totalTasks > 0) {
        progress = (completedTasks / totalTasks) * 100;
    }

    const progressBar = document.getElementById(`${key}-progress-bar`);
    if (progressBar) {
        progressBar.setAttribute('width', progress + '%');
    }

    setSubtasksNumberToHTML(key, progress, totalTasks, completedTasks);
}


/**
 * Handles the case when subtask length is greater than zero.
 * @param {Array} tasks - List of tasks for the key.
 * @param {string} key - The key identifying the task.
 * @param {number} completedTasks - Number of completed tasks.
 */
function subtasksLengthIsHigherThenNull(tasks, key, completedTasks) {

    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById(`${key}-progress-bar`);
    if (progressBar) {
        progressBar.setAttribute('width', progress + '%');
    }

    setSubtasksNumberToHTML(key, progress, totalTasks, completedTasks);

}


/**
 * Updates the progress bar and subtask completion count for a specific task.
 * @param {string} key - The identifier for the task element.
 * @param {number} progress - The progress percentage to set for the task.
 * @param {number} totalTasks - The total number of subtasks for the task.
 * @param {number} completedTasks - The number of completed subtasks.
 * @returns {void}
 */
function setSubtasksNumberToHTML(key, progress, totalTasks, completedTasks) {
    document.getElementById(`${key}-progress-bar`).setAttribute('width', progress + '%');

    let clickedSubtaskLength = document.getElementById(`${key}-completed-task`);
    clickedSubtaskLength.innerHTML = `${completedTasks}/${totalTasks} Subtasks`;
}


/**
 * Updates the progress bar based on completed tasks.
 */
function updateProgressBar() {
    let completedTasks = 0;

    const tasks = allTasks[0][currentKey]['subtask'];

    tasks.forEach((task, index) => {
        if (task['status']) {
            let taskIndex = tasks[index];
            completedTasks++;
            console.log(completedTasks);
            changeSubtaskToTrueOrFalse(taskIndex, index);
        }

        else {
            let taskIndex = tasks[index];
            changeSubtaskToTrueOrFalse(taskIndex, index);
        }
    });
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;
    setSubtasksNumberToHTML(currentKey, progress, totalTasks, completedTasks);
}


/**
 * Toggles the status of a subtask checkbox.
 * @param {HTMLElement} element - The HTML element representing the checkbox.
 */
function toggleCheckBoxForSubtask(element) {

    let getAttribute = element.getAttribute('onclick');
    console.log(getAttribute);

    let match = getAttribute.match(/toggleCheckBoxForSubtask\(this, (\d+)\)/);

    if (match && match[1]) {
        let number = parseInt(match[1]);
        let currentSubtask = allTasks[0][currentKey]['subtask'][number]

        if (element.src.includes("checkbox_icon.svg")) {
            element.src = "./img/login_img/checkbox_icon_selected.svg";
            currentSubtask['status'] = true;
        }

        else {
            element.src = "./img/login_img/checkbox_icon.svg";
            currentSubtask['status'] = false;
        }
    }

    updateProgressBar();
}


/**
 * Changes the status of a subtask (true or false) via a PUT request.
 * @param {Object} task - The subtask object to update.
 * @param {number} index - The index of the subtask in the array.
 */
async function changeSubtaskToTrueOrFalse(tasks, index) {
    await fetch(BASE_URL + "task/" + currentKey + "/subtask" + "/" + index + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tasks)
    });
}


/**
 * Sets checkbox icons based on the status of subtasks.
 */
function setCheckboxIcons() {
    const statuses = allTasks[0][currentKey]['subtask']; // Ensure currentKey is defined and valid

    if (statuses) {
        statuses.forEach((status, index) => {
            const icon = status['status'] ? './img/login_img/checkbox_icon_selected.svg' : './img/login_img/checkbox_icon.svg';
            const checkboxElement = document.getElementById(`checkbox${index}`);
            if (checkboxElement) {
                checkboxElement.src = icon;
            }
        });
    }
}