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

    try {
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
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

async function checkLoginStatusAndRedirect() {
    const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

    try {
        const response = await fetch(BASE_URL + 'users.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();

        const isAnyUserLoggedIn = Object.values(users).some(user => user.loginStatus === true);

        if (!isAnyUserLoggedIn) {
            window.location.href = 'index.html';
        } else {
            console.log('User is logged in, proceed with page load');
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}