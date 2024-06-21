const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

async function loginUser() {
    try {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let response = await fetch(BASE_URL + "users.json");
        let users = await response.json();

        let user = Object.values(users).find(user => user.email === email);
        if (!user) {
            alert("Invalid email or password. Please try again.");
            return;
        }

        let userKey = Object.keys(users).find(key => users[key].email === email);

        if (user.password === password) {
            localStorage.setItem('emailUser', email);
            loginSave();
            await updateUserLoginStatus(userKey, email, user.name, password, true);

            let welcomeUserNameElement = document.getElementById('welcome-user-name');
            if (welcomeUserNameElement) {
                welcomeUserNameElement.innerHTML = user.name;
            }

            window.location.href = 'welcome.html';
        } else {
            alert("Invalid email or password. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while trying to log in. Please try again. Error: " + error.message);
    }
}

async function updateUserLoginStatus(userKey, email, name, password, status) {
    await fetch(BASE_URL + "users/" + userKey + ".json", {
        method: "PUT",
        body: JSON.stringify({
            email: email,
            name: name,
            password: password,
            loginStatus: status
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
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
        email: email,
        name: name,
        password: password,
        loginStatus: false,
    };

    let userExists = await checkIfUserExists(email);
    if (userExists) {
        alert("Die E-Mail-Adresse ist bereits registriert.");
        return;
    }

    let success = await addUserToDatabase(user);
    if (success) {
        showSuccessMessage();
    }
}

async function addUserToDatabase(user) {
    try {
        let response = await fetch(BASE_URL + "users.json", {
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

async function checkIfUserExists(email) {
    try {
        let response = await fetch(BASE_URL + "users.json");
        if (response.ok) {
            let users = await response.json();
            return Object.values(users).some(user => user.email === email);
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