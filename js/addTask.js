const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

let currentBtn;

/**
 * This function deletes all entries
 */

function clearTask() {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });

    activateMediumBtn();
    clearSelectedPrio();
  
}

function activateMediumBtn() {
    let mediumBtn = document.getElementById('medium-btn');
    mediumBtn.classList.add('medium');
}

function clearSelectedPrio(){
    if (currentBtn) {
        currentBtn.classList.remove(`${currentBtn.getAttribute('data-color')}`);
    }
}

/**
 * The color is assigned to the button when clicked
 * 
 * @param {Event} btn - used event to identify the selected button
 * @param {String} color - color will be passed as a string
 */
function changeColorPrioBtn(btn, color) {

    let mediumBtn = document.getElementById('medium-btn');
    mediumBtn.classList.remove('medium')

    clearSelectedPrio();

    btn.classList.add(color);
    btn.setAttribute('data-color', color);

    currentBtn = btn;
}

function getDataFromTask() {
    let email = 'okan.ozel@hotmail.de'
    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
    let prio = currentBtn? currentBtn.getAttribute('data-color') : currentBtn = 'medium';
    let subtask = document.getElementById('task-subtask').value;

    let emailKey = email.replace(/[.#$/\[\]]/g, '-');

    let taskDetails = {
        'title':title,
        'description':description,
        'date':date,
        'prio':prio,
        'subtask':subtask
    }

    console.log(taskDetails);
    pushTaskToDatabase(emailKey, taskDetails);
}

async function pushTaskToDatabase(emailKey,taskDetails){
    try {
        let response = await fetch(BASE_URL + "users/" + emailKey + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskDetails)
        });
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Benutzers:", error);
    }
}

