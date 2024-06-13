const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let task ={
    'todo':'',
    'inprogress':'',
    'feedback': '',
    'done':''
}

async function loadUsers() {
    let response = await fetch(BASE_URL + "users.json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}

async function addUserToDatabase(emailKey, user) {
    try {
        let response = await fetch(BASE_URL + "users/" + emailKey + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error('Fehler beim Hinzufügen des Benutzers zur Datenbank.');
        }
        console.log("Benutzer wurde erfolgreich hinzugefügt.");
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Benutzers:", error);
    }
}

async function checkIfUserExists(emailKey) {
    try {
        let response = await fetch(BASE_URL + "users/" + emailKey + ".json");
        if (response.ok) {
            let existingUser = await response.json();
            return existingUser !== null;
        } else {
            throw new Error('Netzwerkantwort war nicht in Ordnung.');
        }
    } catch (error) {
        console.error("Fehler beim Überprüfen des Benutzers:", error);
        return false;
    }
}

async function addUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let user = {
        name: name,
        password: password,
        'task':task
    };

    let emailKey = email.replace(/[.#$/[\]]/g, '-');

    let userExists = await checkIfUserExists(emailKey);
    if (userExists) {
        alert("Die E-Mail-Adresse ist bereits registriert.");
        return;
    }

    await addUserToDatabase(emailKey, user);
}