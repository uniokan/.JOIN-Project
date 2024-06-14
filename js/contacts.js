const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadContacts(){
    let response = await fetch(BASE_URL + "contacts/" + ".json");

    let userData = await response.json();

    console.log(userData);
}