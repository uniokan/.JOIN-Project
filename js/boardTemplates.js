function openEditTaskHTML(){
    return `<div class="taskSelect" >
                <div class="taskSelectContainer"></div>
                <div class="close" onclick="closePopUp('task')"><img src="./img/taskOverlay_img/close.svg" alt="" /></div>
            </div>

            <div class="container">
                <div class="">Title</div>
                <input type="text" id="edited-title">
            </div>
            <div class="container">
                <div  class="">Description</div>
                <textarea id="edited-description" type="text">Build start page with recipe recommendation.</textarea>
            </div>

            <div class="container">
                <div class="">Due date</div>
                <input id="task-date" type="date" />
            </div>

            <div class="container">
                <div class="">Priority</div>
                 <div class="prio w-400">
                            <button id="urgent-btn" onclick="changePrioColorToUrgent(this,'urgent')"
                                type="button">Urgent <img id="img-urgent" src="img/add_task_img/urgent.png"></button>
                            <button id="medium-btn" class="medium bold"
                                onclick="changePrioColorToMedium(this, 'medium')" type="button">Medium <img
                                    id="img-medium" src="img/add_task_img/medium.png"></button>
                            <button id="low-btn" onclick="changePrioColorToLow(this, 'low')" type="button">Low <img
                                    id="img-low" src="img/add_task_img/low.png"></button>
                        </div>
            </div>

            <div class="container">
                <div class="">Assigned To</div>
                    <div class="assigned-to-container w-400 mb-20" id="assigned-to-container">
                        <div class="assigned-to " onclick="openDropDown('assigned-to')">
                            <span id="select-assigned-to" class="pl16">Select contacts to assign</span>
                            <img class="arrow-drop-down pr16" src="img/add_task_img/arrow_drop_down.png">
                        </div>
                        <div class="drop-down-hidden d-none mb-20 assigned-to-pop-up" id="assigned-to">
                            TEST
                        </div>
                        <div class="mb-20" id="contacts-initials-container">
                               
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="input-container">
                            <div class="add-task-subtask w-400 mb-90">
                                <input oninput="changeAddIconFromSubtask()" id="task-subtask"
                                    class="border pl16 clear-task ht48" placeholder="Add new subtask">
                                <div id="subtask-img-container">
                                    <img src="img/add_task_img/add.png" onclick="addSubtask()">
                                </div>
                            </div>
                            <div class="new-subtask-container w-400 mt--90">
                                <ul id="new-subtask"></ul>
                            </div>
                        </div>
            </div>

            <div class="okBtnContainer">
                <button onclick="getEditedText()" class="okBtn">
                    Ok<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5.55057 9.65L14.0256 1.175C14.2256 0.975 14.4631 0.875 14.7381 0.875C15.0131 0.875 15.2506 0.975 15.4506 1.175C15.6506 1.375 15.7506 1.6125 15.7506 1.8875C15.7506 2.1625 15.6506 2.4 15.4506 2.6L6.25057 11.8C6.05057 12 5.81724 12.1 5.55057 12.1C5.28391 12.1 5.05057 12 4.85057 11.8L0.550573 7.5C0.350573 7.3 0.25474 7.0625 0.263073 6.7875C0.271407 6.5125 0.375573 6.275 0.575573 6.075C0.775573 5.875 1.01307 5.775 1.28807 5.775C1.56307 5.775 1.80057 5.875 2.00057 6.075L5.55057 9.65Z"
                            fill="white"
                        />
                    </svg>
                </button>
            </div>
       `
}


function gererateTaskHTML(element) {
    let reducedText = '';
    let assignedToHTML = '';
    currentKey=element['key'];

    if (element['assignedTo'] != null) {
        assignedToHTML = generateAssignedToHTML(element);
    }

    if (element['description'] != null) {
        reducedText = reducedDescriptionText(element);
    }

    return `
         <div id="${element['key']}" onclick="openPopUp('task-pop-up', '${element['key']}');  closePopUpOutsideContainer('task');" class="task-smallview" draggable="true" ondragstart="startDragging('${element['key']}')" ondragend="removeRotation('${element['key']}')">
             <span id="${element['key']}-category" class="task-smallview-title">${element['category']}</span>
             <h3 id="${element['key']}-title" class="smallview-title">${element['title']}</h3>
             <div class="lightgray smallview-description" id="${element['key']}-description">${reducedText}</div>
             <span id="${element['key']}-subtask">......... 1/2 Subtasks</span>
             <div class="space-between ml8">
                 <div id="${element['key']}-assignedto" class="board-assignetTo-container" name="${element['fullname']}">
                     ${assignedToHTML}
                 </div>
                 <img id="${element['key']}-prio" src="img/add_task_img/${element['prio']}.png">
             </div>
         </div>
     `;
}


function generateAssignedToHTML(element) {
    let assignedToHTML = '';
    let assignedPeople = element['assignedTo'].slice(0, 3);

    assignedPeople.forEach(person => {
        let initials = getFirstAndLastInitials(person['fullname']);
        let fullName = person['fullname'];

        assignedToHTML += `
        <div class="assigned-person">
                <div class="assigned-to-popup">
                    <div class="circle ml-16" style="background-color: ${person['color']}">${initials}</div>
                    <div class="d-none"> ${fullName} </div>
                </div>
        </div>
        `;
    });

    return assignedToHTML;
}