const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";


let keyCounter=0;


function init() {
    getKeyCounter();
    includeHTML();
    showAddedContact();
 
}

function getData() {
    let userName = document.getElementById('name-user');
    let userEmail = document.getElementById('email-user');
    let userTel = document.getElementById('tel-user');
    createContact(userEmail.value, userName.value, userTel.value);
}


function createContact(userEmail, userName, userTel) {
    let userInfo = {
        'name': userName,
        'email': userEmail,
        'tel': userTel
    }

    addContact(userInfo);
}


async function addContact(userInfo) {
   let response= await fetch(BASE_URL + "contacts/" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    });
    let newContact = await response.json();
    keyCounter++;
    safeKeyCounter();

    let newContactKey = Object.keys(newContact)[keyCounter];
    getDataFromDatabase({ [newContactKey]: userInfo }, newContactKey);
}


async function safeKeyCounter() {
    await fetch(BASE_URL + "keycounter/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(keyCounter)
    });

}


async function getKeyCounter() {
    let response = await fetch(BASE_URL + "keycounter/" + ".json");
    let responseJson = await response.json();

    keyCounter = responseJson;
}


async function showAddedContact() {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    for (let i=0; i<keyCounter+1; i++){
        let key = await getKeyFromUser(i);
        getDataFromDatabase(responseToJson, key);
    }

}


function getDataFromDatabase(userInfo, key){
    let container = document.getElementById('contacts');

    let email = userInfo[key]['email'];
    let name = userInfo[key]['name'];
    let tel = userInfo[key]['tel'];

    container.innerHTML+= `
            <div class="contactsData" >
                <div class="container">
                    <div class="circle">AB</div>
                </div>
                <div>
                    <span> ${name} </span>
                    <span> ${email} </span>
                </div>
            </div>`
}


async function getKeyFromUser(i) {
    let response = await fetch(BASE_URL + "contacts/" + ".json");
    let responseToJson = await response.json();

    let key = (Object.keys(responseToJson)[i]);
    return key;
}


function showAddContactPopUp(){
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');

    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    closePopUpOutsideContainer();
}


function closePopUp(){
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');

    backgroundDim.classList.remove('background-dim');
    addTaskPopUp.classList.remove('pop-up-100vh');
    addTaskPopUp.classList.add('pop-up-hidden');

}


function closePopUpOutsideContainer() {
    let backgroundDim = document.getElementById('background-dim');
    let popUp = document.getElementById('add-task-pop-up');

    backgroundDim.addEventListener('click', event => {
        if (!popUp.contains(event.target)) {
            closePopUp();
        }
    });

    backgroundDim.addEventListener('mousemove', event => {
        if (popUp.contains(event.target)) {
            backgroundDim.style.cursor='unset';
        }

        else{
            backgroundDim.style.cursor='pointer';
        }
    });
}