const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let currentBtn;
let subtaskCounter = 0;
let subtaskTexts = [];
let counterKey= 0;

/**
 * This function deletes all entries
 */

function clearTask() {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });

    activateMediumBtn();
    clearSelectedPrio();
}


/**
 * This function activates the medium button with background color by clear
 */
function activateMediumBtn() {
    let mediumBtn = document.getElementById('medium-btn');
    mediumBtn.classList.add('medium');
    mediumBtn.classList.add('bold');
}


/**
 * This function clears the background color and font-weight of the button when another button is selected 
 * */
function clearSelectedPrio() {
    if (currentBtn) {
        currentBtn.classList.remove(`${currentBtn.getAttribute('data-color')}`);
        currentBtn.classList.remove(`${currentBtn.getAttribute('bold')}`);
    }
}


/**
 * The color is assigned to the button when clicked
 * 
 * @param {Event} btn - used event to identify the selected button
 * @param {String} color - color will be passed as a string
 */
function changeColorPrioBtn(btn, color) {

    let mediumBtn = document.getElementById('medium-btn');
    mediumBtn.classList.remove('medium')
    mediumBtn.classList.remove('bold')

    clearSelectedPrio();

    btn.classList.add(color);
    btn.classList.add('bold');
    btn.setAttribute('data-color', color);
    btn.setAttribute('bold', 'bold');

    currentBtn = btn;
}


/**
 * This function gets all input from the user and then saves it in SafeTaskDetails
 */
function getDataFromTask() {
    let email = 'okan.ozel@hotmail.de'
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
    let prio = currentBtn ? currentBtn.getAttribute('data-color') : currentBtn = 'medium';
    getSubtasks();

    let emailKey = email.replace(/[.#$/\[\]]/g, '-');

    let taskDetails = safeTaskDetails(title, description, date, prio, subtaskTexts);

    console.log(taskDetails);
    pushTaskToDatabase(emailKey, taskDetails);
}


/**
 * This function fetches all created subtasks
 */
function getSubtasks(){
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
function safeTaskDetails(title, description, date, prio, subtask) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtask
    }
}

/**
 * This function pushes the saved data in Json to database
 * 
 * @param {string} emailKey - the logged in email address
 * @param {JSON} taskDetails - contains all data in JSON format
 */
async function pushTaskToDatabase(emailKey, taskDetails) {
    try {
        await fetch(BASE_URL + "users/" + emailKey + "/task/todo" + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskDetails)
        });
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Daten", error);
    }

    getKeyFromUser();
    counterKey++;
}

async function getKeyFromUser(){
    let emailKey = 'okan-ozel@hotmail-de'
    let response = await fetch(BASE_URL + "users/" + emailKey + "/task/todo" + ".json");
    let responseToJson = await  response.json();

    console.log(responseToJson);
    let key= (Object.keys(responseToJson)[counterKey]);
    return key;
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


/**
 * This function opens the dropdown menu from category and at the same time checks whether body was clicked
 */
function openDropDownCategory() {
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

    if (subtaskValidation(input)) {
        newSubtask.innerHTML += `<li class="new-subtask-added">${input.value}</li>`;
        input.value = '';
        subtaskCounter++;
    }

    else {
        alert('Mehr als 5 Subtasks nicht möglich und die Länge der Subtask muss zwischen 3-10 Zeichen liegen!')
    }
}


/**
 * This function validates the subtask
 * 
 * @param {string} input - this is the input from the user in the subtask field
 * @returns - true or false
 */
function subtaskValidation(input) {
    return subtaskCounter <= 4 && input.value.length >= 3 && input.value.length <= 15;
}