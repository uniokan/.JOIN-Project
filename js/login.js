const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

async function loginUser() {
    try {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let emailKey = email.replace(/[.#$/\[\]]/g, '-');

        let response = await fetch(BASE_URL + "users/" + emailKey + ".json");

        let userData = await response.json();

        let key = (Object.keys(userData)[0]);
        let name = userData[key].name;

        let passwordFromDatabase = await fetchWithKey(key, emailKey);

        if (userData && passwordFromDatabase === password) {
            localStorage.setItem('emailUser', email);
            loginSave();
            await loginStatus(emailKey, key, name, password);
            document.getElementById('welcome-user-name').innerHTML=name;
            window.location.href = 'welcome.html';
        } else {
            alert("Invalid email or password. Please try again.");
        }

    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while trying to log in. Please try again. Error: " + error.message);
    }
}

async function fetchWithKey(key, emailKey) {
    let response = await fetch(BASE_URL + "users/" + emailKey + '/' + key + ".json");

    let userData = await response.json();
    let password = userData['password'];
    return password;
}

async function addUser() {
    let checkBoxIcon = document.getElementById('checkBoxIcon2').src;
    let errorElement = document.getElementById('error');

    if (checkBoxIcon.includes('checkbox_icon.svg')) {
        alert("Bitte akzeptieren Sie die Policy.");
        return;
    }

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        errorElement.style.display = 'block';
        return;
    } else {
        errorElement.style.display = 'none';
    }

    let user = {
        name: name,
        password: password,
        loginStatus: false,
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
            method: "POST",
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
    let checkBoxIcons = document.querySelectorAll("#checkBoxIcon, #checkBoxIcon2");

    checkBoxIcons.forEach(checkBoxIcon => {
        if (checkBoxIcon.src.includes("checkbox_icon.svg")) {
            checkBoxIcon.src = "../img/login_img/checkbox_icon_selected.svg";
        } else {
            checkBoxIcon.src = "../img/login_img/checkbox_icon.svg";
        }
        checkBoxIcon.style.width = "24px";
        checkBoxIcon.style.height = "24px";
    });
}

function loginSave() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let checkBoxIcon = document.getElementById('checkBoxIcon');

    if (checkBoxIcon.src.includes("checkbox_icon_selected.svg")) {
        checkBoxIcon.src = "../img/login_img/checkbox_icon_selected.svg";
        checkBoxIcon.style.width = "24px";
        checkBoxIcon.style.height = "24px";

        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    } else {
        console.log("Checkbox icon source does not include 'checkbox_icon.svg'");
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
            window.location.href = 'index.html?skipAnimation=true';
        }, 500);
    }, 2000);
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('skipAnimation')) {
        disableAnimation();
    }

    let savedEmail = localStorage.getItem('email');
    let savedPassword = localStorage.getItem('password');

    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
}


function disableAnimation() {
    const animatedElement = document.getElementById('animatedElement');
    if (animatedElement) {
        animatedElement.classList.add('no-animation');
    }
}

async function loginStatus(emailKey, key, name, password) {
    await fetch(BASE_URL + "users/" + emailKey + "/" + key + ".json", {
        method: "PUT",
        body: JSON.stringify({
            name: name,
            password: password,
            loginStatus: true
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
}