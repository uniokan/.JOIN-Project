const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

// async function loadUsers() {
//     let response = await fetch(BASE_URL + "users.json");
//     let responseToJson = await response.json();
//     console.log(responseToJson);
// }

async function loginUser() {
    try {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let emailKey = email.replace(/[.#$/\[\]]/g, '-');

        let response = await fetch(BASE_URL + "users/" + emailKey + ".json");
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data. Status: ' + response.status);
        }

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

    return false; 
}
