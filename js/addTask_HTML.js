function generateContactCheckbox(html, name, firstChar, color) {
    return `
        <div class="contacts-checkbox">
            <div class="name-with-initials">
                <div class="circle" style="background-color: ${nameColors[color]};">${firstChar}</div>
                <span class="getName" onclick="categorySelected(this,'assigned-to-${html}')"> ${name} </span> 
            </div>
            <img id="${nameColors[color]}-${firstChar}" onclick="toggleCheckBox(this, '${name}', '${html}')" class="u" src="./img/login_img/checkbox_icon.svg" style="width: 24px; height: 24px;">
        </div> `
}


function addedSubtaskHTML(newValue) {
    return `
            <li>${newValue}</li>
            <div class="subtask-icons" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)"></div>
        `
}


function editSubtaskHTML(currentText) {
   return  `
            <input type="text" value="${currentText}" onkeydown="saveEditByEnter(event, this)" id="edit-input">
            <div class="subtask-icons"><img src="./img/add_task_img/delete.png" onclick="deleteSubtask(this)"> | <img src="./img/add_task_img/check.svg" onclick="saveEditByCheckmark(this)"></div>
        `
}


function editSubtaskOnHoverHTML(){
  return   `<img src="./img/add_task_img/edit.png" onclick="editSubtask(this)"> | <img src="./img/add_task_img/delete.png" onclick="deleteSubtask(this)">`
}

function addAndDeleteIconsForSubtasksHTML(html){
return `<div class="subtask-check-delete-container"> <span class="delete-input-subtask-x" onclick="deleteInputSubtask('addtask')">X</span> | <img class="add-subtask-check" onclick="addSubtask('${html}')" src="./img/add_task_img/check.svg"</div>`
}

function contentOfAddedSubtaskHTML(input) {
    return `
        <div class="new-subtask-added" onmouseenter="changeSubtaskLiContent(this)" onmouseleave="resetSubtaskLiContent(this)">
            <li >${input.value}
            </li>
            <div class="subtask-icons"></div>
            
        </div>`
}