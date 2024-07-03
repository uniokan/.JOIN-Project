const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Logs in a user by verifying email and password, and redirects to the welcome page if successful.
 * Shows an error message if the login fails.
 */
async function loginUser() {
    let email = document.getElementById('emailLogin').value;
    let password = document.getElementById('passwordLogin').value;

    let users = await fetchUsers();
    let user = findUserByEmail(users, email);

    if (!user) {
        showError("Invalid email or password. Please try again.");
        return;
    }

    let userKey = getUserKey(users, email);
    let name = formatUserName(users[userKey].name);

    if (user.password === password) {
        saveUserSession(email, name);
        await updateUserLoginStatus(userKey, email, user.name, password, true);
        openSite('welcome.html', 'summary-link');


    } else {
        showError("Invalid email or password. Please try again.");
    }
}

function openSite(link, id) {
    localStorage.setItem('changeBgColor', id);
    window.location.href = link;
}

document.addEventListener('DOMContentLoaded', function () {
    let idToChangeBg = localStorage.getItem('changeBgColor');
    let anchor = document.getElementById(idToChangeBg);
    if (anchor) {
        anchor.style.borderRadius = '16px';
        anchor.style.backgroundColor = "#091931";
        localStorage.removeItem('changeBgColor');
    }
});


/**
 * Fetches the list of users from the server.
 * @returns {Promise<Object>} A promise that resolves to the users object.
 */
async function fetchUsers() {
    let response = await fetch(BASE_URL + "users.json");
    return await response.json();
}


/**
 * Finds a user by their email address.
 * @param {Object} users - The users object.
 * @param {string} email - The email address to search for.
 * @returns {Object|undefined} The user object if found, otherwise undefined.
 */
function findUserByEmail(users, email) {
    return Object.values(users).find(user => user.email === email);
}


/**
 * Gets the key of a user by their email address.
 * @param {Object} users - The users object.
 * @param {string} email - The email address to search for.
 * @returns {string|undefined} The user key if found, otherwise undefined.
 */
function getUserKey(users, email) {
    return Object.keys(users).find(key => users[key].email === email);
}


/**
 * Formats the user's name by abbreviating the second part if it's longer than 6 characters.
 * @param {string} name - The full name of the user.
 * @returns {string} The formatted name.
 */
function formatUserName(name) {
    let nameParts = name.split(' ');

    if (nameParts.length > 1 && nameParts[1].length > 6) {
        nameParts[1] = nameParts[1][0] + '.';
    }

    return nameParts.join(' ');
}


/**
 * Saves the user's session information in local storage.
 * @param {string} email - The user's email address.
 * @param {string} name - The user's formatted name.
 */
function saveUserSession(email, name) {
    localStorage.setItem('emailUser', email);
    localStorage.setItem('nameUser', name);
    loginSave();
}


/**
 * Displays the sign-up form and hides the login form.
 */
function showSignUp() {
    let login = document.getElementById('showLogin');
    let signup = document.getElementById('showSignup');

    login.classList.add('hidden');
    signup.classList.add('signUp');
    login.classList.remove('overlay');
    signup.classList.remove('hidden');
}


/**
 * Displays the login form and hides the sign-up form.
 */
function showLogin() {
    let login = document.getElementById('showLogin');
    let signup = document.getElementById('showSignup');

    login.classList.remove('hidden');
    signup.classList.remove('signUp');
    login.classList.add('overlay');
    signup.classList.add('hidden');
}


/**
 * Updates the login status of the user.
 * 
 * @param {string} userKey - The key of the user in the database.
 * @param {string} email - The email of the user.
 * @param {string} name - The name of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} status - The login status of the user.
 * @returns {Promise<void>}
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
 * Asynchronously adds a user if the policy is accepted and all validations pass.
 * 
 * @async
 * @function addUser
 * @returns {Promise<void>}
 */
async function addUser() {
    if (!isPolicyAccepted()) {
        showError("Please accept the policy");
        return;
    }

    let { name, email, password, confirmPassword } = getValueFromInput();

    if (!validatePasswords(password, confirmPassword)) {
        return;
    }

    name = capitalizeFirstLetterOfEachWord(name);
    let user = createUserObject(email, name, password);

    if (await checkIfUserExists(email)) {
        showError("This email address is already registered.");
        return;
    }

    if (await addUserToDatabase(user)) {
        clearForm();
        showSuccessMessage();
    }
}


/**
 * Retrieves values from input fields.
 * 
 * @function getValueFromInput
 * @returns {Object} An object containing name, email, password, and confirmPassword.
 * @returns {string} return.name - The name input value.
 * @returns {string} return.email - The email input value.
 * @returns {string} return.password - The password input value.
 * @returns {string} return.confirmPassword - The confirm password input value.
 */
function getValueFromInput() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    return { name, email, password, confirmPassword };
}


/**
 * Clears the input form fields.
 * 
 * @function clearForm
 * @returns {void}
 */
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    let checkbox = document.getElementById('checkBoxIcon2');

    checkbox.src = './img/login_img/checkbox_icon.svg';
}


/**
 * Checks if the policy is accepted by the user.
 * 
 * @returns {boolean} - Returns true if the policy is accepted, false otherwise.
 */
function isPolicyAccepted() {
    let checkBoxIcon = document.getElementById('checkBoxIcon2').src;
    return !checkBoxIcon.includes('checkbox_icon.svg');
}


/**
 * Validates if the provided passwords match.
 * Displays an error message if passwords do not match.
 * 
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The confirmation of the user's password.
 * @returns {boolean} - Returns true if the passwords match, false otherwise.
 */
function validatePasswords(password, confirmPassword) {
    let errorElement = document.getElementById('error');
    if (password !== confirmPassword) {
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}


/**
 * Creates a user object with the provided email, name, and password.
 * 
 * @param {string} email - The user's email.
 * @param {string} name - The user's name.
 * @param {string} password - The user's password.
 * @returns {Object} - Returns a user object with the given properties.
 */
function createUserObject(email, name, password) {
    return {
        email: email,
        name: name,
        password: password,
        loginStatus: false,
    };
}


/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} name - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetterOfEachWord(name) {
    return name.replace(/\b\w/g, char => char.toUpperCase());
}


/**
 * Adds a new user to the database.
 * 
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<boolean>} - Returns true if the user is added successfully, otherwise false.
 */
async function addUserToDatabase(user) {
    let response = await fetch(BASE_URL + "users.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    return true;
}


/**
 * Checks if a user already exists in the database based on their email.
 * 
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - Returns true if the user exists, otherwise false.
 */
async function checkIfUserExists(email) {
    let response = await fetch(BASE_URL + "users.json");
    if (response.ok) {
        let users = await response.json();
        return Object.values(users).some(user => user.email === email);
    }
}


/**
 * Toggles the checkbox icon between selected and unselected states.
 */
function toggleCheckBox() {
    let checkBoxIcons = document.querySelectorAll("#checkBoxIcon, #checkBoxIcon2");

    checkBoxIcons.forEach(checkBoxIcon => {
        if (checkBoxIcon.src.includes("checkbox_icon.svg")) {
            checkBoxIcon.src = "./img/login_img/checkbox_icon_selected.svg";
        } else {
            checkBoxIcon.src = "./img/login_img/checkbox_icon.svg";
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
        checkBoxIcon.src = "./img/login_img/checkbox_icon_selected.svg";
        checkBoxIcon.style.width = "24px";
        checkBoxIcon.style.height = "24px";

        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
    }
}


/**
 * Displays a success message overlay and redirects to the login page.
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
            showLogin();
        }, 500);
    }, 2000);
}


/**
 * Executes functions on window load such as disabling animations and populating saved email and password.
 */
window.onload = function () {
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
 * Logs in a guest user by updating their login status and storing their email in localStorage.
 * @returns {Promise<void>}
 */
async function guestLogin() {
    const KEY = "-O-uRAuDbNBS14Z-OgQR";
    let response = await fetch(`${BASE_URL}/users/${KEY}.json`);

    let user = await response.json();

    let updatedUser = createUpdatedUser(user);

    await updateUser(KEY, updatedUser);

    setLocalStorage(user);

    openSite('welcome.html', 'summary-link');
}


/**
 * Creates an updated user object with login status set to true.
 * @param {Object} user - The original user object.
 * @returns {Object} The updated user object.
 */
function createUpdatedUser(user) {
    return {
        email: user.email,
        name: user.name,
        password: user.password,
        loginStatus: true
    };
}


/**
 * Updates the user data on the server.
 * @param {string} key - The user key.
 * @param {Object} updatedUser - The updated user object.
 * @returns {Promise<Response>} The response from the server.
 */
async function updateUser(key, updatedUser) {
    const response = await fetch(`${BASE_URL}/users/${key}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    });

    return response;
}


/**
 * Sets the user email and name in localStorage.
 * @param {Object} user - The user object.
 */
function setLocalStorage(user) {
    localStorage.setItem('emailUser', user.email);
    localStorage.setItem('nameUser', user.name);
}


/**
 * Displays an error message overlay.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    let overlay = document.getElementById('overlay');
    let errorDiv = document.getElementById('errorDiv');

    overlay.classList.add('show');
    errorDiv.classList.add('show');
    errorDiv.textContent = message;

    setTimeout(function () {
        overlay.classList.remove('show');
        errorDiv.classList.remove('show');
    }, 2000);
}

function openSiteWithoutLogin(link) {
    // Speichere den Zustand in localStorage
    localStorage.setItem('hideElements', 'true');
    // Leite zur neuen Seite weiter
    window.location.href = link;
}