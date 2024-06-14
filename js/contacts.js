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
