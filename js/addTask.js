const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let currentBtn;
let subtaskTexts = [];
let counterKey = 0;
let addTask = [];
const urgent = 'urgent';
const medium = 'medium'
const low = 'low';
let isActive = true;
let urgentActive = false;
let mediumActive = true;
let lowActive = false;

/**
 * This function is executed at the beginning of the script
 */
function init() {
    includeHTML();
    activateMediumBtn();
    getCurrentDate();
    getTasksFromLocalStorage();
}

/**
 * This function deletes all entries
 */
function clearTask() {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });

    activateMediumBtn();
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(low);
    deleteSubtaskWithClearButton();
}


/**
 * This function activates the medium button with background color by clear
 */
function activateMediumBtn() {
    let mediumBtn = document.getElementById('medium-btn');
    let mediumBtnIcon = document.getElementById('img-medium');

    mediumBtn.classList.add('medium', 'bold');
    mediumBtnIcon.src = `img/add_task_img/medium.svg`;
}


/**
 * This function changes the color of the button to Urgent and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToUrgent(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(medium);
    disactiveOtherBtn(low);
    urgentActiveTrue();
}

/**
 * This function changes the color of the button to medium and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToMedium(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(low);
    mediumActiveTrue();
}


/**
 * This function changes the color of the button to low and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToLow(btn, color) {
    changeColor(btn, color);
    disactiveOtherBtn(urgent);
    disactiveOtherBtn(medium);
    lowActiveTrue();
}


/**
 * This function sets the boolean value of urgent to true - this is needed for saving localstorage/database
 */
function urgentActiveTrue() {
    urgentActive = true
    mediumActive = lowActive = false;
}


/**
 * This function sets the boolean value of medium to true - this is needed for saving localstorage/database
 */
function mediumActiveTrue() {
    mediumActive = true;
    urgentActive = lowActive = false;
}


/**
 * This function sets the boolean value of low to true - this is needed for saving localstorage/database
 */
function lowActiveTrue() {
    lowActive = true;
    mediumActive = urgentActive = false;

}


/**
 * This function changes the color of the button
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changeColor(btn, color) {
    btn.classList.add(color);
    changeIconColor(color);
}


/**
 * This function changes the color of the respective icon
 * 
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changeIconColor(color) {
    let getImg = document.getElementById(`img-${color}`);
    getImg.src = `./img/add_task_img/${color}.svg`;
}


/**
 * This function deactivates the color of the button that was previously clicked
 * 
 * @param {string} color - in html the color is passed as a string, e.g. urgent 
 */
function disactiveOtherBtn(color) {
    let mediumBtn = document.getElementById(`${color}-btn`);
    let getMediumImg = document.getElementById(`img-${color}`);

    getMediumImg.src = `img/add_task_img/${color}.png`;
    mediumBtn.classList.remove(color, 'bold')
}


/**
 * This function gets all input from the user and then saves it in SafeTaskDetails
 */
function getDataFromTask() {
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
    let category = document.getElementById('select-task-category').innerText;
    getSubtasks();
    let prio = checkWichPrioSelected();

    let taskDetails = safeTaskDetails(title, description, date, category, prio);

    addTask.push(taskDetails);

    pushTaskToLocalstorage();
}

/**
 * This function checks which prio is true
 * 
 * @returns - returns the color of prio as a string
 */
function checkWichPrioSelected() {
    if (urgentActive) return 'urgent'

    else if (mediumActive) return 'medium'

    else return 'low'
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
 * @param {string} subtaskTexts - contains the subtasks from JSON
 * @returns JSON Object
 */
function safeTaskDetails(title, description, date, category, prio) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtaskTexts,
        'category': category,
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


/**
 * This function checks which category was selected and changes the text of the container
 * 
 * @param {keyword} element - This is the element that was clicked
 */
function categorySelected(element) {
    openDropDownCategory();
    let selectCategory = document.getElementById('select-task-category');

    selectCategory.innerHTML = element.innerText
}


/**
 * This function pushes the data into localstorage
 */
function pushTaskToLocalstorage() {
    localStorage.setItem('tasks', JSON.stringify(addTask));
    localStorage.setItem('task_counter', JSON.stringify(counterKey));
    counterKey++
}


/**
 * This function fetches the data from localstorage
 */
function getTasksFromLocalStorage() {
    let tasks = localStorage.getItem('tasks');
    let taskCounter = localStorage.getItem('task_counter');
    if (tasks && taskCounter) {
        addTask = JSON.parse(tasks);
        counterKey = JSON.parse(taskCounter);
    } else {
        addTask = [];
    }
}


/**
 * This function changes the icons of the subtask field as soon as something is entered into the input field.
 */
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


/**
 * This function clears the value of subtask input field as soon as the user clicks on X
 */
function deleteInputSubtask() {
    let inputSubtask = document.getElementById('task-subtask');
    let imgContainer = document.getElementById('subtask-img-container');

    inputSubtask.value = '';
    imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask()">`
}


/**
 * This function removes the icons from the added subtask if you no longer access the subtask. onmouseleave is used for html
 * 
 * @param {keyword} content - content is the element that you click on with the mouse
 */
function resetSubtaskLiContent(content) {
    let iconsContainer = content.querySelector('.subtask-icons');
    if (iconsContainer && isActive) {
        iconsContainer.innerHTML = '';
    }
}


/**
 * Added this function for icons to the added subtasks. These icons are needed for editing and deleting subtasks. onmouse enter method is used
 * 
 * @param {keyword} content - content is the element that you click on with the mouse
 */
function changeSubtaskLiContent(content) {
    let iconsContainer = content.querySelector('.subtask-icons');
    if (iconsContainer && isActive) {
        iconsContainer.innerHTML = `<img src="/img/add_task_img/edit.png" onclick="editSubtask(this)"> | <img src="/img/add_task_img/delete.png" onclick="deleteSubtask(this)">`; // Set new content
    }
}


/**
 * This function deletes the added subtask with a click on the trash icon
 * 
 * @param {keyword} element - this is the element you want to delete 'this'
 */
function deleteSubtask(element) {
    let subtaskDiv = element.closest('.new-subtask-added');
    if (subtaskDiv) {
        subtaskDiv.remove();
        isActive = true;
    }

}


/**
 * This function deletes the added subtasks with a click on the clear button
 */
function deleteSubtaskWithClearButton() {
    let getSubtask = document.querySelectorAll('.new-subtask-added');

    getSubtask.forEach(subtask => {
        subtask.remove();
    })
}


/**
 * This function edits the added subtaks
 * 
 * @param {keyword} element - this is the element you want to edit 'this'
 */
function editSubtask(element) {
    let subtaskDiv = element.closest('.new-subtask-added');
    if (subtaskDiv) {
        let li = subtaskDiv.querySelector('li');
        let currentText = li.innerText;
        subtaskDiv.innerHTML = `
            <input type="text" value="${currentText}" onkeydown="saveEditByEnter(event, this)" id="edit-input">
            <div class="subtask-icons"><img src="/img/add_task_img/delete.png" onclick="deleteSubtask(this)"> | <img src="/img/add_task_img/check.svg" onclick="saveEditByCheckmark(this)"></div>
        `;
        isActive = false;
        setTimeout(() => {
            document.getElementById('edit-input').select();
        }, 0);


    }
}


/**
 * This function edits the added subtaks with the enter key
 * 
 * @param {event} event - when you press enter the change is applied
 * @param {keyword} inputElement - this is the element you want to edit 'this'
 */
function saveEditByEnter(event, inputElement) {
    if (event.key === 'Enter') {
        let newValue = inputElement.value;
        let subtaskDiv = inputElement.closest('.new-subtask-added');
        if (subtaskDiv) {
            subtaskDiv.innerHTML = `
                <li>${newValue}</li>
                <div class="subtask-icons" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"></div>
            `;
            isActive = true;
        }
    }
}


/**
 * This function edits the added subtaks with checkmark
 * 
 * @param {keyword} inputElement - this is the element you want to edit 'this'
 */
function saveEditByCheckmark(inputElement) {
    let newValue = document.getElementById('edit-input').value;
    let subtaskDiv = inputElement.closest('.new-subtask-added');
    if (subtaskDiv) {
        subtaskDiv.innerHTML = `
            <li>${newValue}</li>
            <div class="subtask-icons" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"></div>
        `;
        isActive = true;
    }
}


/**
 * This function always gets the current date at the beginning of the script and sets it in the html 'min' attribute
 */
function getCurrentDate() {
    let taskDateInput = document.getElementById('task-date');

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    let minDate = yyyy + '-' + mm + '-' + dd;
    taskDateInput.setAttribute('min', minDate);
}


/**
 * This function shows animated text that the task was successfully added
 */
function showSuccessMessage() {
    let successMessage = document.getElementById('successMessage-addTask');

    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            window.location.href = 'board.html?skipAnimation=true';
        }, 500);
    }, 2000);
}
