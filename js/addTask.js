const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let currentBtn;
let subtaskTexts = [];
let counterKey = 0;
let addTask = [];
const urgent = 'urgent';
const medium = 'medium'
const low = 'low';
let isActive = true;

/**
 * This function deletes all entries
 */

function init() {
    includeHTML();
    activateMediumBtn();
}

function clearTask() {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });

    activateMediumBtn();
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(low);
}


/**
 * This function activates the medium button with background color by clear
 */
function activateMediumBtn() {
    let mediumBtn = document.getElementById('medium-btn');
    let mediumBtnIcon = document.getElementById('img-medium');

    mediumBtn.classList.add('medium');
    mediumBtn.classList.add('bold');
    mediumBtnIcon.src = `img/add_task_img/medium.svg`;
}


function changePrioColorToUrgent(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(medium);
    disactiveOtherBtn(low);
}


function changePrioColorToMedium(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(low);
}


function changePrioColorToLow(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(medium);
}


function changeColor(btn, color) {
    btn.classList.add(color);
    changeIconColor(color);
}


function changeIconColor(color) {
    let getImg = document.getElementById(`img-${color}`);
    getImg.src = `./img/add_task_img/${color}.svg`;
}


function disactiveOtherBtn(color) {
    let mediumBtn = document.getElementById(`${color}-btn`);
    let getMediumImg = document.getElementById(`img-${color}`);

    getMediumImg.src = `img/add_task_img/${color}.png`;
    mediumBtn.classList.remove(color)
    mediumBtn.classList.remove('bold')
}


/**
 * This function gets all input from the user and then saves it in SafeTaskDetails
 */
function getDataFromTask() {
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
    let prio = currentBtn ? currentBtn.getAttribute('data-color') : currentBtn = 'medium';
    let category = document.getElementById('select-task-category').innerText;
    getSubtasks();

    let taskDetails = safeTaskDetails(title, description, date, prio, subtaskTexts, category);

    console.log(taskDetails);
    pushTaskToLocalstorage(taskDetails);
}


/**
 * This function fetches all created subtasks
 */
function getSubtasks() {
    let subtasks = document.querySelectorAll('.new-subtask-added');

    subtasks.forEach(subtask => {
        subtaskTexts.push(subtask.innerText);
    });
}


/**
 * This function saves all inputs in json
 * 
 * @param {string} title - contains the title from the input field
 * @param {string} description - contains the description from the input field
 * @param {string} date - contains the date from the input field
 * @param {string} prio - contains the prio from the input field
 * @param {string} subtask - contains the subtasks from JSON
 * @returns JSON Object
 */
function safeTaskDetails(title, description, date, prio, subtask, category) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtask,
        'category': category
    }
}


/**
 * This function opens the dropdown menu from assigned to and at the same time checks whether body was clicked
 */
function dropDownAssigendTo() {
    let assignedTo = document.getElementById('assigned-to');
    assignedTo.classList.toggle('d-none');

    let assignedToContainer = document.getElementById('assignedTo-container');
    closeDropDownWithBody(assignedTo, assignedToContainer);
}

function resetCategory() {
    let standardText = document.getElementById('select-task-category');
    standardText.innerHTML = 'Select task category'
}


/**
 * This function opens the dropdown menu from category and at the same time checks whether body was clicked
 */
function openDropDownCategory() {
    resetCategory();
    let category = document.getElementById('category');
    category.classList.toggle('d-none');

    let categoryContainer = document.getElementById('category-container');
    closeDropDownWithBody(category, categoryContainer);
}


/**
 * This function closes the drop down menu
 * 
 * @param {string} dropDownContent - shows the contents contained in the dropdown menu
 */
function closeDropDown(dropDownContent) {
    dropDownContent.classList.add('d-none');
}


/**
 * This function closes the drop down menu when body is clicked
 * 
 * @param {string} dropDownContent - shows the contents contained in the dropdown menu
 * @param {string} dropDownContainer - the variable is the dropdown container
 */
function closeDropDownWithBody(dropDownContent, dropDownContainer) {
    document.body.addEventListener('click', (event) => {

        if (targetOutsideOfContainer(event, dropDownContent, dropDownContainer)) {
            closeDropDown(dropDownContent);
        }
    })
}


/**
 * This function checks whether clicks were made outside of dropdown menus
 * 
 * @param {event} event - this event is the mouse click
 * @param {*} dropDownContent - shows the contents contained in the dropdown menu
 * @param {*} dropDownContainer - the variable is the dropdown container
 * @returns - true or false
 */
function targetOutsideOfContainer(event, dropDownContent, dropDownContainer) {
    return !dropDownContent.classList.contains('d-none') && !dropDownContent.contains(event.target) && !dropDownContainer.contains(event.target)
}


/**
 * This function adds the subtask in the form of li element
 */
function addSubtask() {
    let input = document.getElementById('task-subtask');
    let newSubtask = document.getElementById('new-subtask');
    let imgContainer = document.getElementById('subtask-img-container');

    if (subtaskValidation(input)) {
        newSubtask.innerHTML += `
        <div class="new-subtask-added" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)">
            <li >${input.value}
            </li>
            <div class="subtask-icons" id="subtask-icons"></div>
            
        </div>`;

        input.value = '';
        imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask()">`
    }

    else {
        alert('Die Länge der Subtask muss zwischen 3-10 Zeichen liegen!')
    }
}


/**
 * This function validates the subtask
 * 
 * @param {string} input - this is the input from the user in the subtask field
 * @returns - true or false
 */
function subtaskValidation(input) {
    return input.value.length >= 3 && input.value.length <= 15;
}


function categorySelected(element) {
    openDropDownCategory();
    let selectCategory = document.getElementById('select-task-category');

    selectCategory.innerHTML = element.innerText
}


function pushTaskToLocalstorage(taskDetails) {
    let titleAsText = JSON.stringify(taskDetails['title']);
    let descriptionAsText = JSON.stringify(taskDetails['description']);
    let dateAsText = JSON.stringify(taskDetails['date']);
    let prioAsText = JSON.stringify(taskDetails['prio']);
    let subtaskAsText = JSON.stringify(taskDetails['subtask']);
    let categoryAsText = JSON.stringify(taskDetails['category']);

    localStorage.setItem('title', titleAsText);
    localStorage.setItem('description', descriptionAsText);
    localStorage.setItem('dateAsText', dateAsText);
    localStorage.setItem('prio', prioAsText);
    localStorage.setItem('subtask', subtaskAsText);
    localStorage.setItem('category', categoryAsText);
}


function changeAddIconFromSubtask() {
    let inputSubtask = document.getElementById('task-subtask').value;
    let imgContainer = document.getElementById('subtask-img-container');

    if (inputSubtask.length > 0) {
        imgContainer.innerHTML = `<div class="subtask-check-delete-container"> <span class="delete-input-subtask-x" onclick="deleteInputSubtask()">X</span> | <img class="add-subtask-check" onclick="addSubtask()" src="./img/add_task_img/check.svg"</div>`
    }

    else {
        imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask()">`
    }
}


function deleteInputSubtask() {
    let inputSubtask = document.getElementById('task-subtask');
    let imgContainer = document.getElementById('subtask-img-container');

    inputSubtask.value = '';
    imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask()">`
}


function resetSubtaskLiContent(content) {
    let iconsContainer = content.querySelector('.subtask-icons');
    if (iconsContainer && isActive) {
        iconsContainer.innerHTML = ''; // Clear the content
    }
}


function changeSubtaskLiContent(content) {
    let iconsContainer = content.querySelector('.subtask-icons');
    if (iconsContainer && isActive) {
        iconsContainer.innerHTML = `<img src="/img/add_task_img/edit.png" onclick="editSubtask(this)"> | <img src="/img/add_task_img/delete.png" onclick="deleteSubtask(this)">`; // Set new content
    }
}


function deleteSubtask(element) {
    let subtaskDiv = element.closest('.new-subtask-added');
    if (subtaskDiv) {
        subtaskDiv.remove();
        isActive=true;
    }
    
}


function editSubtask(element) {
    let subtaskDiv = element.closest('.new-subtask-added');
    if (subtaskDiv) {
        let li = subtaskDiv.querySelector('li');
        let currentText = li.innerText;
        subtaskDiv.innerHTML = `
            <input type="text" value="${currentText}" onkeydown="saveEditByEnter(event, this)" id="edit-input">
            <div class="subtask-icons"><img src="/img/add_task_img/delete.png" onclick="deleteSubtask(this)"> | <img src="/img/add_task_img/check.png" onclick="saveEditByCheckmark(this)"></div>
        `;
        isActive=false;
        setTimeout(() => {
            document.getElementById('edit-input').select();
        }, 0);

        
    }
}


function saveEditByEnter(event, inputElement) {
    if (event.key === 'Enter') {
        let newValue = inputElement.value;
        let subtaskDiv = inputElement.closest('.new-subtask-added');
        if (subtaskDiv) {
            subtaskDiv.innerHTML = `
                <li>${newValue}</li>
                <div class="subtask-icons" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"></div>
            `;
            isActive=true;
        }
    }
}


function saveEditByCheckmark(inputElement) {
    let newValue = document.getElementById('edit-input').value;
    let subtaskDiv = inputElement.closest('.new-subtask-added');
    if (subtaskDiv) {
        subtaskDiv.innerHTML = `
            <li>${newValue}</li>
            <div class="subtask-icons" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"></div>
        `;
        isActive=true;
    }
}