const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Logs in the user by checking their credentials and updating their login status.
 */
async function loginUser() {
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
    let name = users[userKey].name
    console.log(name);

    if (user.password === password) {
        localStorage.setItem('emailUser', email);
        localStorage.setItem('nameUser', name);
        loginSave();
        await updateUserLoginStatus(userKey, email, user.name, password, true);

        window.location.href = 'welcome.html';
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

/**
 * Updates the login status of the user.
 * 
 * @param {string} userKey - The key of the user in the database.
 * @param {string} email - The email of the user.
 * @param {string} name - The name of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} status - The login status of the user.
 */
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

/**
 * Adds a new user to the database after validating the input fields.
 */
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

/**
 * Adds a new user to the database.
 * 
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<boolean>} - Returns true if the user is added successfully, otherwise false.
 */
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

/**
 * Checks if a user already exists in the database based on their email.
 * 
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - Returns true if the user exists, otherwise false.
 */
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

/**
 * Toggles the checkbox icon between selected and unselected states.
 */
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

/**
 * Saves the user's login details to localStorage if the checkbox is selected.
 */
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

/**
 * Displays a success message overlay and redirects to the index page.
 */
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

/**
 * Executes functions on window load such as disabling animations and populating saved email and password.
 */
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

/**
 * Disables the animation of the element with the id 'animatedElement'.
 */
function disableAnimation() {
    const animatedElement = document.getElementById('animatedElement');
    if (animatedElement) {
        animatedElement.classList.add('no-animation');
    }
}

/**
 * Log in a guest user by updating their login status and storing their email in localStorage.
 */
async function guestLogin() {
    const KEY = "-O-uRAuDbNBS14Z-OgQR";
    let response = await fetch(`${BASE_URL}/users/${KEY}.json`);

    let user = await response.json();

    let updatedUser = {
        email: user.email,
        name: user.name,
        password: user.password,
        loginStatus: true
    };

    response = await fetch(`${BASE_URL}/users/${KEY}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    });

    localStorage.setItem('emailUser', user.email);
    localStorage.setItem('nameUser', user.name);


    window.location.href = 'welcome.html';
}