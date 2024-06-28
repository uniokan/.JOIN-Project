const hexColors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];

/**
 * Initializes the contacts application by including HTML, getting data from the database, 
 * and retrieving the user's name from local storage.
 */
function initContacts() {
    includeHTML();
    getDataFromDatabase();
    getNameLocalStorage();
}

/**
 * Shows the contact dropdown menu and overlay.
 */
function dropDownMenuContact() {
    document.getElementById('dropdownContact').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

/**
 * Closes the contact dropdown menu and overlay.
 */
function closeDropDownMenuContact() {
    document.getElementById('dropdownContact').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

/**
 * Closes the contact card popup.
 */
function closePopUpMenuContact() {
    let popUp = document.getElementById('contactCardPopUp');
    popUp.style.display = 'none';
}

/**
 * Retrieves data from the add contact form and creates a new contact.
 */
function getDataFromAddContact() {
    let userName = document.getElementById('name-contact-site');
    let userEmail = document.getElementById('email-contact-site');
    let userTel = document.getElementById('tel-contact-site');
    let randomColor = getRandomColor();
    let addContactTrue = true;

    createContact(userEmail.value, userName.value, userTel.value, randomColor, addContactTrue);
    closePopUp('add');
    clearInput(userEmail, userName, userTel);
}

/**
 * Retrieves data from the edit contact form and updates the contact.
 */
function getDataFromEditContact() {
    let userName = document.getElementById('edit-contact-name');
    let userEmail = document.getElementById('edit-contact-email');
    let userTel = document.getElementById('edit-contact-tel');
    let randomColor = getRandomColor();
    let addContactTrue = false;

    createContact(userEmail.value, userName.value, userTel.value, randomColor, addContactTrue);
    closePopUp('edit');
    clearInput(userEmail, userName, userTel);
}

/**
 * Clears the input fields.
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} name - The name input element.
 * @param {HTMLElement} tel - The telephone input element.
 */
function clearInput(email, name, tel) {
    email.value = '';
    name.value = '';
    tel.value = '';
}

/**
 * Gets a random color from the hexColors array.
 * @returns {string} A random hex color code.
 */
function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * hexColors.length);
    return hexColors[randomIndex];
}

/**
 * Creates a new contact or updates an existing contact in the database.
 * @param {string} userEmail - The user's email.
 * @param {string} userName - The user's name.
 * @param {string} userTel - The user's telephone number.
 * @param {string} randomColor - A random color for the contact.
 * @param {boolean} addContactTrue - Flag indicating whether to add (true) or edit (false) the contact.
 */
async function createContact(userEmail, userName, userTel, randomColor, addContactTrue) {
    let userInfo = {
        'name': userName,
        'email': userEmail,
        'tel': userTel,
        'color': randomColor,
    }

    if (addContactTrue) {
        addContact(userInfo);
    } else {
        await editContactInDatabase(userInfo);
    }
}

/**
 * Adds a new contact to the database and shows it in the UI.
 * @param {Object} userInfo - The contact information.
 */
async function addContact(userInfo) {
    let response = await fetch(BASE_URL + "contacts/" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });
    let newContactKey = await response.json();
    showAddContact({ [newContactKey.name]: userInfo }, newContactKey.name);
}

/**
 * Fetches data from the database and displays it in the UI.
 */
async function getDataFromDatabase() {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    for (let key in responseToJson) {
        showAddContact(responseToJson, key);
    }
}

/**
 * Displays a contact in the UI.
 * @param {Object} userInfo - The contact information.
 * @param {string} key - The key of the contact in the database.
 */
function showAddContact(userInfo, key) {
    if (key != undefined) {
        let container = document.getElementById('contacts');
        let email = userInfo[key]['email'];
        let name = userInfo[key]['name'];
        let tel = userInfo[key]['tel'];
        let randomColor = userInfo[key]['color'];
        let initials = getInitials(name);
        let firstChar = name[0].toUpperCase();

        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = container.innerHTML;

        let header = tempDiv.querySelector('#header-' + firstChar);
        if (!header) {
            createAndInsertHeader(tempDiv, firstChar);
        }

        let group = tempDiv.querySelector('#group-' + firstChar);
        createContactHTML(group, name, email, tel, randomColor, initials, key);

        container.innerHTML = tempDiv.innerHTML;
    }
}

/**
 * Gets the initials from a name.
 * @param {string} name - The name to get initials from.
 * @returns {string} The initials of the name.
 */
function getInitials(name) {
    return name.split(' ')
        .slice(0, Math.min(name.split(' ').length, 2))
        .map(n => n[0])
        .join('')
        .toUpperCase();
}

/**
 * Creates the HTML for a contact header.
 * @param {string} firstChar - The first character of the contact name.
 * @returns {string} The HTML string for the contact header.
 */
function createContactHeader(firstChar) {
    return `
        <div id="header-${firstChar}" class="contact-header">
            <h2>${firstChar}</h2><hr>
            <div class="contact-group" id="group-${firstChar}"></div>
        </div>
    `;
}

/**
 * Inserts the contact header into the temporary div.
 * @param {HTMLElement} tempDiv - The temporary div element.
 * @param {string} newHeaderHTML - The HTML string for the new header.
 * @param {string} firstChar - The first character of the contact name.
 */
function insertContactHeader(tempDiv, newHeaderHTML, firstChar) {
    let inserted = false;
    let headers = tempDiv.getElementsByClassName('contact-header');
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].id > 'header-' + firstChar) {
            headers[i].insertAdjacentHTML('beforebegin', newHeaderHTML);
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        tempDiv.innerHTML += newHeaderHTML;
    }
}

/**
 * Creates and inserts a contact header into the temporary div.
 * @param {HTMLElement} tempDiv - The temporary div element.
 * @param {string} firstChar - The first character of the contact name.
 */
function createAndInsertHeader(tempDiv, firstChar) {
    let newHeaderHTML = createContactHeader(firstChar);
    insertContactHeader(tempDiv, newHeaderHTML, firstChar);
}

/**
 * Creates the HTML for a contact and appends it to the contact group.
 * @param {HTMLElement} group - The contact group element.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} tel - The contact telephone number.
 * @param {string} randomColor - The random color for the contact.
 * @param {string} initials - The initials of the contact name.
 * @param {string} key - The key of the contact in the database.
 */
function createContactHTML(group, name, email, tel, randomColor, initials, key) {
    group.innerHTML += `
        <div class="contactsData" onclick="showContactDetails('${name}', '${email}', '${tel}', '${randomColor}', '${key}')">
            <div class="container">
                <div class="circle" style="background-color: ${randomColor};">${initials}</div>
            </div>
            <div class="name-email-container">
                <span id="${key}-name">${name}</span>
                <span id="${key}-email" class="blue">${email}</span>
            </div>
        </div>
    `;
}

/**
 * Gets the key of a user from the database.
 * @param {number} i - The index of the user.
 * @returns {Promise<string>} The key of the user.
 */
async function getKeyFromUser(i) {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    let key = (Object.keys(responseToJson)[i]);
    return key;
}

/**
 * Shows the add contact popup.
 * @param {string} select - The id of the popup content to show.
 */
function showAddContactPopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    closePopUpOutsideContainer(select);
}

/**
 * Closes the popup.
 * @param {string} select - The id of the popup content to hide.
 */
function closePopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let taskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.add('d-none');
    backgroundDim.classList.remove('background-dim');
    taskPopUp.classList.remove('pop-up-100vh');
    taskPopUp.classList.add('pop-up-hidden');
}

/**
 * Closes the popup when clicking outside of it.
 * @param {string} select - The id of the popup content.
 */
function closePopUpOutsideContainer(select) {
    let backgroundDim = document.getElementById('background-dim');
    let popUp = document.getElementById('add-task-pop-up');

    backgroundDim.addEventListener('click', event => {
        if (!popUp.contains(event.target)) {
            closePopUp(select);
        }
    });

    backgroundDim.addEventListener('mousemove', event => {
        if (popUp.contains(event.target)) {
            backgroundDim.style.cursor = 'unset';
        } else {
            backgroundDim.style.cursor = 'pointer';
        }
    });
}

/**
 * Shows the contact details in a popup.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} tel - The contact telephone number.
 * @param {string} randomColor - The random color for the contact.
 * @param {string} key - The key of the contact in the database.
 */
function showContactDetails(name, email, tel, randomColor, key) {
    let detailsDiv = document.getElementById('contact-details');

    let allContacts = document.querySelectorAll('.contactsData');
    allContacts.forEach(contact => contact.classList.remove('active'));

    let popUp = document.getElementById('contactCardPopUp');
    popUp.style.display = 'block';

    let clickedContact = document.querySelector(`.contactsData[onclick="showContactDetails('${name}', '${email}', '${tel}', '${randomColor}', '${key}')"]`);
    clickedContact.classList.add('active');

    if (detailsDiv.classList.contains('active')) {
        detailsDiv.classList.remove('active');
        setTimeout(() => {
            updateAndShowDetails(detailsDiv, name, email, tel, randomColor, key);
        }, 300);
    } else {
        updateAndShowDetails(detailsDiv, name, email, tel, randomColor, key);
    }
}

/**
 * Updates and shows the contact details in the details div.
 * @param {HTMLElement} detailsDiv - The details div element.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} tel - The contact telephone number.
 * @param {string} randomColor - The random color for the contact.
 * @param {string} key - The key of the contact in the database.
 */
function updateAndShowDetails(detailsDiv, name, email, tel, randomColor, key) {
    let initials = name.split(' ').slice(0, Math.min(name.split(' ').length, 2)).map(n => n[0]).join('').toUpperCase();

    detailsDiv.innerHTML = updateAndShowDetailsHTML(initials, name, email, tel, randomColor, key);

    detailsDiv.classList.add('active');
    detailsDiv.classList.remove('hidden');
}

/**
 * Clears the contact list and details view.
 */
function clearListAndDetails() {
    let container = document.getElementById('contacts');
    let contactDetails = document.getElementById('contact-details');

    container.innerHTML = '';
    contactDetails.innerHTML = '';
}

/**
 * Deletes a contact from the database.
 * @param {string} key - The key of the contact to delete.
 */
async function deleteContact(key) {
    await fetch(BASE_URL + "contacts/" + key + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    clearListAndDetails();
    getDataFromDatabase();
    closePopUp('edit');
}

/**
 * Gets the key of the user currently being edited and deletes the contact.
 */
function getUserKey() {
    let onsubmit = document.getElementById('edit-contact-form');
    let key = onsubmit.getAttribute('key');
    deleteContact(key);
}

/**
 * Opens the edit contact popup and fills the input fields with the contact's information.
 * @param {string} key - The key of the contact to edit.
 */
function openEditContact(key) {
    fillInputFields(key);
    let onsubmit = document.getElementById('edit-contact-form');
    onsubmit.setAttribute('key', key);
    showAddContactPopUp('edit');
}

/**
 * Fills the input fields in the edit contact form with the contact's information.
 * @param {string} key - The key of the contact to edit.
 */
function fillInputFields(key) {
    let nameId = document.getElementById(`${key}-name`);
    let emailId = document.getElementById(`${key}-email`);
    let telId = document.getElementById(`${key}-tel`);

    let inputName = document.getElementById('edit-contact-name');
    let inputEmail = document.getElementById('edit-contact-email');
    let inputTel = document.getElementById('edit-contact-tel');

    inputName.value = nameId.innerText;
    inputEmail.value = emailId.innerText;
    inputTel.value = telId.innerText;
}

/**
 * Updates a contact in the database.
 * @param {Object} userInfo - The contact information.
 */
async function editContactInDatabase(userInfo) {
    let onsubmit = document.getElementById('edit-contact-form');
    let key = onsubmit.getAttribute('key');

    await fetch(BASE_URL + "contacts/" + key + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });

    clearListAndDetails();
    getDataFromDatabase();
}
