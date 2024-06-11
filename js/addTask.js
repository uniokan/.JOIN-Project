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
    let title = document.getElementById('task-title');
    let description = document.getElementById('task-description');
    // let assignedTo = document.getElementById('task-assignedTo');
    let date = document.getElementById('task-date');
    let prio = currentBtn.getAttribute('data-color');
    // let category = document.getElementById('task-category');
    let subtask = document.getElementById('task-subtask');

    console.log(email, title.value, description.value, date.value, subtask.value, prio);
}