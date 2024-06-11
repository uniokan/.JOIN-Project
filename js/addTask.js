let currentBtn;

/**
 * This function deletes all entries
 */

function clearTask() {
    let getValues = document.querySelectorAll('.clear-task');
    getValues.forEach(input => {
        input.value = ''
    });
}



/**
 * The color is assigned to the button when clicked
 * 
 * @param {Event} btn - used event to identify the selected button
 * @param {String} color - color will be passed as a string
 */
function changeColorPrioBtn(btn, color) {

    if (currentBtn) {
        currentBtn.classList.remove(`${currentBtn.getAttribute('data-color')}`);
    }

    btn.classList.add(color);
    btn.setAttribute('data-color', color);

    currentBtn = btn;
}