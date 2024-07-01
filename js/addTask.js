//////////////Global variables/////////////////////
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
let contacts = [];
let names = [];
let keys = [];
let nameColors = [];
let assignedTo = [];


/**
 * This function is executed at the beginning of the script
 */
function initAddTaskScript(html) {
    includeHTML();
    activateMediumBtn(html);
    getCurrentDate('addtask');
    checkLoginStatusAndRedirect();
    getContacts(html);
    getNameLocalStorage();
}


/**
 * This function deletes all entries
 */
function clearTask(html) {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });

    clearContactContainer(html);
    activateMediumBtn(html);
    disactiveOtherBtn(urgent, html);
    disactiveOtherBtn(low, html);
    deleteSubtaskWithClearButton();
}


/**
 * This function deletes all choosed contacts
 */
function clearContactContainer(html){
    let container = document.getElementById(`contacts-initials-container-${html}`)
    container.innerHTML='';
}


/**
 * This function activates the medium button with background color by clear
 */
function activateMediumBtn(html) {
    let mediumBtn = document.getElementById(`medium-btn-${html}`);
    let mediumBtnIcon = document.getElementById(`img-medium-${html}`);

    mediumBtn.classList.add('medium', 'bold');
    mediumBtnIcon.src = `img/add_task_img/medium.svg`;
}


/**
 * This function changes the color of the button to Urgent and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToUrgent(btn, color, html) {
    changeColor(btn, color, html);
    disactiveOtherBtn(medium, html);
    disactiveOtherBtn(low, html);
    urgentActiveTrue();
}


/**
 * This function changes the color of the button to medium and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToMedium(btn, color, html) {
    changeColor(btn, color, html);
    disactiveOtherBtn(urgent, html);
    disactiveOtherBtn(low, html);
    mediumActiveTrue();
}


/**
 * This function changes the color of the button to low and deactivates the colors of the remaining buttons
 * 
 * @param {keyword} btn - btn denotes the clicked button with js keydord 'this'
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changePrioColorToLow(btn, color, html) {
    changeColor(btn, color, html);
    disactiveOtherBtn(urgent, html);
    disactiveOtherBtn(medium, html);
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
function changeColor(btn, color, html) {
    btn.classList.add(color);
    changeIconColor(color, html);
}


/**
 * This function changes the color of the respective icon
 * 
 * @param {string} color - in html the color is passed as a string, e.g. urgent
 */
function changeIconColor(color, html) {
    let getImg = document.getElementById(`img-${color}-${html}`);///////////
    getImg.src = `./img/add_task_img/${color}.svg`;
}


/**
 * This function deactivates the color of the button that was previously clicked
 * 
 * @param {string} color - in html the color is passed as a string, e.g. urgent 
 */
function disactiveOtherBtn(color, html) {
    let mediumBtn = document.getElementById(`${color}-btn-${html}`);
    let getMediumImg = document.getElementById(`img-${color}-${html}`);

    getMediumImg.src = `img/add_task_img/${color}.png`;
    mediumBtn.classList.remove(color, 'bold')
}


/**
 * This function gets all input from the user and then saves it in SafeTaskDetails
 */
async function getDataFromTask(html) {
    let checkIfSelected = isCategorySelected(html);

    if (checkIfSelected) {
        let title = document.getElementById('task-title').value;
        let description = document.getElementById('task-description').value;
        let date = document.getElementById(`task-date-${html}`).value;
        let category = document.getElementById(`select-category-${html}`).innerText;
        getSubtasks();
        let prio = checkWichPrioSelected();
        let step = checkStep();

        let taskDetails = safeTaskDetails(title, description, date, category, prio, assignedTo, step);

        addTask.push(taskDetails);
        await pushToDatabase(taskDetails);
        showSuccessMessage();
    }

    else {
        alert('Bitte wählen Sie eine Kategorie aus!')
    }
}



/**
 * Determines the current step based on the clicked container category.
 * If no category is selected, defaults to 'todo'.
 *
 * @returns {string} The current step.
 */
function checkStep() {
    let step;
    if (clickedContainerCategory == null) {
        step = 'todo';
    }

    else {
        step = clickedContainerCategory
    }

    return step;
}


/**
 * Checks if a category is selected in the given HTML element.
 *
 * @param {string} html - The HTML identifier for the category field.
 * @returns {boolean} True if a category is selected, otherwise false.
 */
function isCategorySelected(html) {
    let categoryField = document.getElementById(`select-category-${html}`);

    let checkIfSelected = categoryField.innerHTML != 'Select task category' ? true : false;

    return checkIfSelected;
}


/**
 * Pushes task details to the database.
 *
 * @param {Object} taskDetails - The details of the task to be pushed.
 * @returns {Promise<void>} A promise that resolves when the task is successfully pushed to the database.
 */
async function pushToDatabase(taskDetails) {
    await fetch(BASE_URL + "task/" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskDetails)
    });
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
        subtaskTexts.push({'name':subtask.innerText, 'status':false });
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
function safeTaskDetails(title, description, date, category, prio, assignedTo, step) {
    return {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'subtask': subtaskTexts,
        'category': category,
        'step': step,
        'assignedTo': assignedTo,
        'completeSubtask' : 0
    }
}


/**
 * Resets the text of a dropdown menu to its default value based on the provided dropdown type.
 *
 * @param {string} dropdown - The type of dropdown to reset ('category' or another type).
 * @param {string} html - The HTML identifier to be used for selecting the element.
 */
function resetCategory(dropdown, html) {
    let standardText = document.getElementById(`select-${dropdown}-${html}`);
    dropdown === "category" ? standardText.innerHTML = 'Select task category' : standardText.innerHTML = 'Select contacts to assign'
}


/**
 * This function opens the dropdown menu from category and at the same time checks whether body was clicked
 */
function openDropDown(dropdown, html) {
    resetCategory(dropdown, html);
    let dropdownMenu = document.getElementById(`${dropdown}-${html}`);
    dropdownMenu.classList.toggle('d-none');

    let dropdownContainer = document.getElementById(`${dropdown}-container-${html}`);
    closeDropDownWithBody(dropdownMenu, dropdownContainer);
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
function addSubtask(html) {
    let input = document.getElementById(`task-subtask-${html}`);
    let newSubtask = document.getElementById(`new-subtask-${html}`);
    let imgContainer = document.getElementById(`subtask-img-container-${html}`);

    if (subtaskValidation(input)) {
        newSubtask.innerHTML += contentOfAddedSubtaskHTML(input);

        input.value = '';
        imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask('${html}')">`
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
    return input.value.length >= 3 && input.value.length <= 45;
}


/**
 * This function checks which category was selected and changes the text of the container
 * 
 * @param {keyword} element - This is the element that was clicked
 */
function categorySelected(element, category, html) {
    openDropDown(`${category}`, `${html}`);
    let selectCategory = document.getElementById(`select-${category}-${html}`);
    let hiddenInput = document.getElementById('is-category-selected');

    selectCategory.innerHTML = element.innerText
}


/**
 * This function changes the icons of the subtask field as soon as something is entered into the input field.
 */
function changeAddIconFromSubtask(html) {
    let inputSubtask = document.getElementById(`task-subtask-${html}`).value;
    let imgContainer = document.getElementById(`subtask-img-container-${html}`);

    if (inputSubtask.length > 0) {
        imgContainer.innerHTML = addAndDeleteIconsForSubtasksHTML(html);
    }

    else {
        imgContainer.innerHTML = `<img src="img/add_task_img/add.png" onclick="addSubtask('${html}')">`
    }
}


/**
 * This function clears the value of subtask input field as soon as the user clicks on X
 */
function deleteInputSubtask(html) {
    let inputSubtask = document.getElementById(`task-subtask-${html}`);
    let imgContainer = document.getElementById(`subtask-img-container-${html}`);

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
        iconsContainer.innerHTML = editSubtaskOnHoverHTML(); 
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
        subtaskDiv.innerHTML = editSubtaskHTML(currentText);
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
            subtaskDiv.innerHTML = addedSubtaskHTML(newValue);
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
        subtaskDiv.innerHTML = addedSubtaskHTML(newValue);
        isActive = true;
    }
}


/**
 * This function always gets the current date at the beginning of the script and sets it in the html 'min' attribute
 */
function getCurrentDate(html) {
    let taskDateInput = document.getElementById(`task-date-${html}`);

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


/**
 * Fetches contacts data from the server, processes the data, and updates the dropdown menu.
 * @param {string} html - The HTML identifier for the dropdown menu container.
 */
async function getContacts(html) {
    let response = await fetch(BASE_URL + '/contacts' + '.json');
    let responseToJson = await response.json();

    contacts.push(responseToJson);
    getKeysWithObjectKey();
    pushNamesInArray();
    pushNamesInDropDown(html);
}


/**
 * Extracts keys from the contacts object and stores them in the keys array.
 */
function getKeysWithObjectKey() {
    for (let i = 0; i < Object.keys(contacts[0]).length; i++) {
        keys.push(Object.keys(contacts[0])[i]);
    }
}


/**
 * Extracts names and their corresponding colors from the contacts object and stores them in arrays.
 */
function pushNamesInArray() {
    keys.forEach(key => {
        names.push(contacts[0][key]['name']);
        nameColors.push(contacts[0][key]['color']);
    });
}


/**
 * Populates the dropdown menu with contact names and their corresponding colors.
 * @param {string} html - The HTML identifier for the dropdown menu container.
 */
function pushNamesInDropDown(html) {
    let container = document.getElementById(`assigned-to-${html}`);
    container.innerHTML = '';
    let color = 0;

    names.forEach(function (name) {
        let firstChar = getFirstAndLastInitials(name);
        container.innerHTML += generateContactCheckbox(html, name,firstChar,color);
        color++;
    });
}


/**
 * Toggles the checkbox for the selected contact and updates the assigned contacts array.
 * @param {HTMLElement} element - The checkbox element.
 * @param {string} fullName - The full name of the contact.
 * @param {string} html - The HTML identifier for the dropdown menu container.
 */
function toggleCheckBox(element, fullName, html) {
    let color = element.id.split('-')[0];
    let name = element.id.split('-')[1];
    let contactInfo = { 'name': name, 'color': color, 'fullname': fullName, 'id': element.id };

    if (element.src.includes("checkbox_icon.svg")) {
        element.src = "./img/login_img/checkbox_icon_selected.svg";
        showSelectedInitials(color, name, html);
        assignedTo.push(contactInfo);
        checkIfAssignedToExistsAndPush(contactInfo);
    } else {
        element.src = "./img/login_img/checkbox_icon.svg";
        removeAssignedToFromArray(element.id);
        removeInitials(color);
    }

    element.style.width = "24px";
    element.style.height = "24px";
}


/**
 * Checks if the assignedTo array exists for the current task and pushes the contact information into it.
 * @param {Object} contactInfo - The contact information object.
 */
function checkIfAssignedToExistsAndPush(contactInfo) {
    if (allTasks.length > 0) {
        if (!allTasks[0][currentKey]['assignedTo']) {
            allTasks[0][currentKey]['assignedTo'] = [];
        }
        allTasks[0][currentKey]['assignedTo'].push(contactInfo);
    }
}


/**
 * Removes the contact from the assignedTo array based on the given ID.
 * @param {string} id - The ID of the contact to be removed.
 */
function removeAssignedToFromArray(id) {
    if (allTasks.length > 0) {
        allTasks[0][currentKey]['assignedTo'] = allTasks[0][currentKey]['assignedTo'].filter(getId => getId['id'] != id);
    }
}


/**
 * Gets the initials (first and last) from the full name.
 * @param {string} fullName - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function getFirstAndLastInitials(fullName) {
    let nameParts = fullName.split(' ');
    let initials = nameParts.map(part => part.charAt(0).toUpperCase());
    return initials.join('');
}


/**
 * Displays the selected initials in the designated container.
 * @param {string} color - The background color of the initials circle.
 * @param {string} name - The initials of the contact.
 * @param {string} html - The HTML identifier for the initials container.
 */
function showSelectedInitials(color, name, html) {
    let container = document.getElementById(`contacts-initials-container-${html}`);
    container.innerHTML += `<div id="${color}" class="circle" style="background-color: ${color};">${name}</div>`;
}


/**
 * Removes the initials element based on the given color.
 * @param {string} color - The color identifier of the initials element to be removed.
 */
function removeInitials(color) {
    let initial = document.getElementById(`${color}`);
    initial.remove();
}