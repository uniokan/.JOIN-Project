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
    let emailKey = email.replace(/[.#$/\[\]]/g, '-');

    let response = await fetch(BASE_URL + "users/" + emailKey + ".json");
    let userData = await response.json();

    let key = Object.keys(userData)[0];

    await fetch(BASE_URL + "users/" + emailKey + "/" + key + ".json", {
        method: "PUT",
        body: JSON.stringify({
            name: userData[key].name,
            password: userData[key].password,
            loginStatus: false
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    localStorage.removeItem('emailUser');
}