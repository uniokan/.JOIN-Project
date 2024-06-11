const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let currentBtn;
let subtaskCounter = 0;
let subtaskTexts = [];

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


function activateMediumBtn() {
    let mediumBtn = document.getElementById('medium-btn');
    mediumBtn.classList.add('medium');
}


function clearSelectedPrio() {
    if (currentBtn) {
        currentBtn.classList.remove(`${currentBtn.getAttribute('data-color')}`);
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

    clearSelectedPrio();

    btn.classList.add(color);
    btn.setAttribute('data-color', color);

    currentBtn = btn;
}


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


function getSubtasks(){
    let subtasks = document.querySelectorAll('.new-subtask-added');

    subtasks.forEach(subtask => {
        subtaskTexts.push(subtask.innerText);
    });
}


function safeTaskDetails(title, description, date, prio, subtask) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtask
    }
}


async function pushTaskToDatabase(emailKey, taskDetails) {
    try {
        await fetch(BASE_URL + "users/" + emailKey + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskDetails)
        });
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Daten", error);
    }
}


function dropDownAssigendTo() {
    let assignedTo = document.getElementById('assigned-to');
    assignedTo.classList.toggle('d-none');

    let assignedToContainer = document.getElementById('assignedTo-container');
    closeDropDownWithBody(assignedTo, assignedToContainer);
}


function openDropDownCategory() {
    let category = document.getElementById('category');
    category.classList.toggle('d-none');

    let categoryContainer = document.getElementById('category-container');
    closeDropDownWithBody(category, categoryContainer);
}


function closeDropDown(dropDownContent) {
    dropDownContent.classList.add('d-none');
}


function closeDropDownWithBody(dropDownContent, dropDownContainer) {
    document.body.addEventListener('click', (event) => {

        if (targetOutsideOfContainer(event, dropDownContent, dropDownContainer)) {
            closeDropDown(dropDownContent);
        }
    })
}


function targetOutsideOfContainer(event, dropDownContent, dropDownContainer) {
    return !dropDownContent.classList.contains('d-none') && !dropDownContent.contains(event.target) && !dropDownContainer.contains(event.target)
}


function addSubtask() {
    let input = document.getElementById('task-subtask');
    let newSubtask = document.getElementById('new-subtask');

    if (subtaskValidation(input)) {
        newSubtask.innerHTML += `<li class="new-subtask-added">${input.value}</li>`;
        input.value = '';
        subtaskCounter++;
    }

    else {
        alert('Mehr als 5 Subtasks nicht möglich und die Länge der Subtask muss zwischen 3-10 Zeichen sein!')
    }
}


function subtaskValidation(input) {
    return subtaskCounter <= 4 && input.value.length >= 3 && input.value.length <= 15;
}