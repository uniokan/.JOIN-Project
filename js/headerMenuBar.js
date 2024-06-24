/**
 * Activates the link corresponding to the current page based on the URL.
 */
function activateCurrentLink() {
    const links = {
        'welcome.html': 'summary-link',
        'add_task.html': 'add-task-link',
        'board.html': 'board-link',
        'contacts.html': 'contacts-link',
        'privacyPolicy.html': 'policy-link',
        'legalNotice.html': 'notice-link',
    };

    const currentPage = window.location.pathname.split('/').pop();
    const activeLinkId = links[currentPage];

    if (activeLinkId) {
        const activeLinkElement = document.getElementById(activeLinkId);

        if (activeLinkElement) {
            activeLinkElement.classList.add('active-link');
        }
    }
}

/**
 * Executes the provided functions after the DOM content is fully loaded and parsed.
 * It includes HTML content using the includeHTML function and activates the current link using activateCurrentLink.
 *
 * @event DOMContentLoaded
 * @callback DOMContentLoadedCallback
 * @param {Function} includeHTML - Function to include HTML content into the document.
 * @param {Function} activateCurrentLink - Function to activate the current link based on the current URL.
 */
document.addEventListener("DOMContentLoaded", function () {
    includeHTML(activateCurrentLink);
});

/**
 * Initializes the dropdown menu functionality.
 * This function toggles the visibility of a dropdown menu when a toggle element is clicked,
 * and hides the dropdown menu when a click event occurs outside the dropdown or its toggle.
 */
setTimeout(function () {
    function dropDownMenu() {
        const toggle = document.getElementById("dropdown-toggle");
        const dropdown = document.getElementById("dropdown");

        toggle.addEventListener("click", function () {
            dropdown.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
                dropdown.classList.remove("show");
            }
        });
    }

    dropDownMenu();
}, 100);

/**
 * Initializes the dropdown menu and handles click outside to close it.
 */
async function logout(event) {
    event.preventDefault();

    let email = localStorage.getItem('emailUser');

    await logoutStatus(email);

    window.location.href = 'index.html';
}

/**
 * Logs out the current user and updates their login status to false.
 * @async
 * @function logout
 * @param {Event} event - The event object for the click on the logout button.
 */
async function logoutStatus(email) {
    const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

    let response = await fetch(BASE_URL + "users.json");
    let users = await response.json();

    let userKey = Object.keys(users).find(key => users[key].email === email);
    let user = users[userKey];

    if (user) {
        await fetch(BASE_URL + "users/" + userKey + ".json", {
            method: "PUT",
            body: JSON.stringify({
                ...user,
                loginStatus: false
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        localStorage.removeItem('emailUser');
        localStorage.removeItem('nameUser')
    }
}

/**
 * Checks the login status of all users and redirects to index page if necessary.
 */
async function checkLoginStatusAndRedirect() {
    const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

    const response = await fetch(BASE_URL + 'users.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let isAnyUserLoggedIn = await checkLoginStatus(response);

    if (!isAnyUserLoggedIn) {
        window.location.href = 'index.html';
    }
}

/**
* Checks the login status of a user based on the response from Firebase.
* @param {Response} response - The response from the Firebase database endpoint.
* @returns {boolean} True if at least one user is logged in; otherwise, False.
*/
async function checkLoginStatus(response) {
    const users = await response.json();

    let welcomeUserNameElement = document.getElementById('welcome-user-name');

    for (const key in users) {
        if (users[key].loginStatus === true) {
            welcomeUserNameElement.innerHTML = users[key].name;
            return true;
        }
    }
    return false;
}

function dropdown(initials) {
    let dropdown = document.getElementById('dropdown-toggle');
    dropdown.innerHTML = `
        <div class="cricleHeader">${initials}</div>
        <div class="dropdown-content" id="dropdown">
            <a href="legalNotice.html">Legal&nbsp;Notice</a>
            <a href="privacyPolicy.html">Privacy&nbsp;Policy</a>
            <a href="#" onclick="logout(event);">Log out</a>
        </div>
    `;

    let logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', logout);
}

function getUsersInitials(name) {
    return name.split(' ')
        .slice(0, Math.min(name.split(' ').length, 2))
        .map(n => n[0])
        .join('')
        .toUpperCase();
}

function getNameLocalStorage(){
    let name = localStorage.getItem('nameUser');
    let initials = getUsersInitials(name);
    dropdown(initials);
}