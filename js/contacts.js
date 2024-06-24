const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";
const hexColors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];


function init() {
    includeHTML();
    getDataFromDatabase();
}


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


function clearInput(email,name,tel){
    email.value='';
    name.value='';
    tel.value='';
}


function getRandomColor() {
    let randomIndex = Math.floor(Math.random() * hexColors.length);
    return hexColors[randomIndex];
}


async function createContact(userEmail, userName, userTel, randomColor, addContactTrue) {
    let userInfo = {
        'name': userName,
        'email': userEmail,
        'tel': userTel,
        'color': randomColor,
    }

    if (addContactTrue) {
        addContact(userInfo);
    }
    else {
        await editContactInDatabase(userInfo);
    }
}


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


async function getDataFromDatabase() {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    for (let key in responseToJson) {
        showAddContact(responseToJson, key);
    }
}


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


function getInitials(name) {
    return name.split(' ')
        .slice(0, Math.min(name.split(' ').length, 2))
        .map(n => n[0])
        .join('')
        .toUpperCase();
}


function createContactHeader(firstChar) {
    return `
        <div id="header-${firstChar}" class="contact-header">
            <h2>${firstChar}</h2><hr>
            <div class="contact-group" id="group-${firstChar}"></div>
        </div>
    `;
}


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


function createAndInsertHeader(tempDiv, firstChar) {
    let newHeaderHTML = createContactHeader(firstChar);
    insertContactHeader(tempDiv, newHeaderHTML, firstChar);
}


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

async function getKeyFromUser(i) {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    let key = (Object.keys(responseToJson)[i]);
    return key;
}


function showAddContactPopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-contact-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    closePopUpOutsideContainer(select);
}


function closePopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-contact-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.add('d-none');
    backgroundDim.classList.remove('background-dim');
    addTaskPopUp.classList.remove('pop-up-100vh');
    addTaskPopUp.classList.add('pop-up-hidden');

}


function closePopUpOutsideContainer(select) {
    let backgroundDim = document.getElementById('background-dim');
    let popUp = document.getElementById('add-contact-pop-up');

    backgroundDim.addEventListener('click', event => {
        if (!popUp.contains(event.target)) {
            closePopUp(select);
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
}


function showContactDetails(name, email, tel, randomColor, key) {
    let detailsDiv = document.getElementById('contact-details');

    let allContacts = document.querySelectorAll('.contactsData');
    allContacts.forEach(contact => contact.classList.remove('active'));


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

function updateAndShowDetails(detailsDiv, name, email, tel, randomColor, key) {
    let initials = name.split(' ').slice(0, Math.min(name.split(' ').length, 2)).map(n => n[0]).join('').toUpperCase();

    detailsDiv.innerHTML = updateAndShowDetailsHTML(initials, name, email, tel, randomColor, key);

    detailsDiv.classList.add('active');
    detailsDiv.classList.remove('hidden');
}


function clearListAndDetails(){
    let container = document.getElementById('contacts');
    let contactDetails = document.getElementById('contact-details');

    container.innerHTML = '';
    contactDetails.innerHTML = '';
}


async function deleteContact(key) { 
    await fetch(BASE_URL + "contacts/" + key + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    clearListAndDetails();
    getDataFromDatabase();
    closePopUp('edit');
}


function getUserKey(){
    let onsubmit = document.getElementById('edit-contact-form');
    let key = onsubmit.getAttribute('key');
    deleteContact(key);
}


function openEditContact(key) {
    fillInputFields(key);
    let onsubmit = document.getElementById('edit-contact-form');
    onsubmit.setAttribute('key', key);
    showAddContactPopUp('edit');

}


function fillInputFields(key){
    let nameId= document.getElementById(`${key}-name`);
    let emailId= document.getElementById(`${key}-email`);
    let telId= document.getElementById(`${key}-tel`);

    let inputName=document.getElementById('edit-contact-name');
    let inputEmail=document.getElementById('edit-contact-email');
    let inputTel = document.getElementById('edit-contact-tel');

    inputName.value=nameId.innerText;
    inputEmail.value=emailId.innerText;
    inputTel.value=telId.innerText;
}


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
