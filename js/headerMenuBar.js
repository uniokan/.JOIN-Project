function activateCurrentLink() {
    const links = {
        'welcome.html': 'summary-link',
        'add_task.html': 'add-task-link',
        'board.html': 'board-link',
        'contacts.html': 'contacts-link'
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

document.addEventListener("DOMContentLoaded", function () {
    includeHTML(activateCurrentLink);
});

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

async function logout(event) {
    event.preventDefault();

    let email = localStorage.getItem('emailUser');

    await logoutStatus(email);

    window.location.href = 'index.html';
}

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
    } else {
        throw new Error('User not found');
    }
}

async function checkLoginStatusAndRedirect() {
    const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

    const response = await fetch(BASE_URL + 'users.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const isAnyUserLoggedIn = await checkLoginStatus(response);

    if (!isAnyUserLoggedIn) {
        window.location.href = 'index.html';
    } else {
        console.log('User is logged in, proceed with page load');
    }
}

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
