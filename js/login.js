const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let tasks = [{'todo': '',
             'inprogress': '',
             'feedback': '',
             'done': '',
            }];

async function loginUser() {
    try {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let emailKey = email.replace(/[.#$/\[\]]/g, '-');

        let response = await fetch(BASE_URL + "users/" + emailKey + ".json");
        
        let userData = await response.json();

        if (userData && userData.password === password) {
            window.location.href = 'welcome.html';
        } else {
            alert("Invalid email or password. Please try again.");
        }

    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while trying to log in. Please try again. Error: " + error.message);
    }
}

async function addUser() {
    let checkBoxIcon = document.getElementById('checkBoxIcon').src;

    if (checkBoxIcon.includes('checkbox_icon.svg')) {
        alert("Bitte akzeptieren Sie die Policy.");
        return;
    }

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let user = {
        name: name,
        password: password,
        task: tasks
    };

    let emailKey = email.replace(/[.#$/[\]]/g, '-');

    let userExists = await checkIfUserExists(emailKey);
    if (userExists) {
        alert("Die E-Mail-Adresse ist bereits registriert.");
        return;
    }

    let success = await addUserToDatabase(emailKey, user);
    if (success) {
        showSuccessMessage();
    }
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
        return true; 
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Benutzers:", error);
        return false; 
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

function toggleCheckBox() {
    let checkBoxIcon = document.getElementById("checkBoxIcon");
  
    if (checkBoxIcon.src.includes("checkbox_icon.svg")) {
      checkBoxIcon.src = "../img/login_img/checkbox_icon_selected.svg";
      checkBoxIcon.style.width = "24px";
      checkBoxIcon.style.height = "24px";
    } else {
      checkBoxIcon.src = "../img/login_img/checkbox_icon.svg";
      checkBoxIcon.style.width = "24px";
      checkBoxIcon.style.height = "24px";
    }
  }

  function showSuccessMessage() {
    let overlay = document.getElementById('overlay');
    let successMessage = document.getElementById('successMessage');
    
    overlay.classList.add('show');
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500); 
    }, 2000);
}