function openEditTaskHTML() {
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
                <input id="task-date-board" type="date" />
            </div>

            <div class="container">
                <div class="">Priority</div>
                 <div class="prio">
                            <button id="urgent-btn-board" onclick="changePrioColorToUrgent(this,'urgent', 'board')"
                                type="button">Urgent <img id="img-urgent-board" src="img/add_task_img/urgent.png"></button>
                            <button id="medium-btn-board" class="medium bold"
                                onclick="changePrioColorToMedium(this, 'medium', 'board')" type="button">Medium <img
                                    id="img-medium-board" src="img/add_task_img/medium.png"></button>
                            <button id="low-btn-board" onclick="changePrioColorToLow(this, 'low', 'board')" type="button">Low <img
                                    id="img-low-board" src="img/add_task_img/low.png"></button>
                        </div>
            </div>

            <div class="container">
                <div class="">Assigned To</div>
                    <div class="assigned-to-container  mb-20" id="assigned-to-container-board">
                        <div class="assigned-to " onclick="openDropDown('assigned-to', 'board')">
                            <span id="select-assigned-to-board" class="pl16">Select contacts to assign</span>
                            <img class="arrow-drop-down pr16" src="img/add_task_img/arrow_drop_down.png">
                        </div>
                        <div class="drop-down-hidden d-none mb-20 assigned-to-pop-up" id="assigned-to-board">
                            TEST
                        </div>
                        <div class="mb-20" id="contacts-initials-container-board">
                               
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="input-container">
                            <div class="add-task-subtask mb-90">
                                <input oninput="changeAddIconFromSubtask('board')" id="task-subtask-board"
                                    class="border pl16 clear-task ht48" placeholder="Add new subtask">
                                <div id="subtask-img-container-board">
                                    <img src="img/add_task_img/add.png" onclick="addSubtask('board)">
                                </div>
                            </div>
                            <div class="new-subtask-container  mt--90">
                                <ul id="new-subtask-board"></ul>
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


function gererateTaskHTML(element, totalSubtask) {
    let reducedText = '';
    let assignedToHTML = '';
    currentKey = element['key'];
    let subtaskLength = totalSubtask != undefined ? totalSubtask.length : 0;

    if (element['assignedTo'] != null) {
        assignedToHTML = generateAssignedToHTML(element);
    }

    if (element['description'] != null) {
        reducedText = reducedDescriptionText(element);
    }

    return `
         <div id="${element['key']}" onclick="openPopUp('task-pop-up', '${element['key']}');  closePopUpOutsideContainer('task');" class="task-smallview" draggable="true" ondragstart="startDragging('${element['key']}')" ondragend="removeRotation('${element['key']}')">
             <div class="task-board-title-container">
                <span id="${element['key']}-category" class="task-smallview-title">${element['category']}</span>
                <div class="svg-board-container" id="${element['key']}-dropdown-board" onclick="dragAndDropMobile(event, '${element['key']}')">
                    <svg class="drop-down-tasks-container" width="6" height="22" viewBox="0 0 6 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.99967 21.6666C2.26634 21.6666 1.63856 21.4055 1.11634 20.8833C0.594119 20.361 0.333008 19.7333 0.333008 18.9999C0.333008 18.2666 0.594119 17.6388 1.11634 17.1166C1.63856 16.5944 2.26634 16.3333 2.99967 16.3333C3.73301 16.3333 4.36079 16.5944 4.88301 17.1166C5.40523 17.6388 5.66634 18.2666 5.66634 18.9999C5.66634 19.7333 5.40523 20.361 4.88301 20.8833C4.36079 21.4055 3.73301 21.6666 2.99967 21.6666ZM2.99967 13.6666C2.26634 13.6666 1.63856 13.4055 1.11634 12.8833C0.594119 12.361 0.333008 11.7333 0.333008 10.9999C0.333008 10.2666 0.594119 9.63881 1.11634 9.11659C1.63856 8.59436 2.26634 8.33325 2.99967 8.33325C3.73301 8.33325 4.36079 8.59436 4.88301 9.11659C5.40523 9.63881 5.66634 10.2666 5.66634 10.9999C5.66634 11.7333 5.40523 12.361 4.88301 12.8833C4.36079 13.4055 3.73301 13.6666 2.99967 13.6666ZM2.99967 5.66659C2.26634 5.66659 1.63856 5.40547 1.11634 4.88325C0.594119 4.36103 0.333008 3.73325 0.333008 2.99992C0.333008 2.26659 0.594119 1.63881 1.11634 1.11659C1.63856 0.594363 2.26634 0.333252 2.99967 0.333252C3.73301 0.333252 4.36079 0.594363 4.88301 1.11659C5.40523 1.63881 5.66634 2.26659 5.66634 2.99992C5.66634 3.73325 5.40523 4.36103 4.88301 4.88325C4.36079 5.40547 3.73301 5.66659 2.99967 5.66659Z" fill="rgba(209, 209, 209, 1)"/>
                    </svg>
                </div>
            </div>
            <div class="drop-down-menu-mobile-board" id="${element['key']}-dropdown-list"></div>
             <h3 id="${element['key']}-title" class="smallview-title">${element['title']}</h3>
             <div class="lightgray smallview-description" id="${element['key']}-description">${reducedText}</div>
             <span class="progressBar" id="${element['key']}-subtask">
                 <svg width="100" height="5">
                     <rect width="100" height="5" fill="#f4f4f4" rx="2.5" ry="2.5"></rect>
                     <rect  id="${element['key']}-progress-bar" width="0%" height="5" fill="#4589FF" rx="2.5" ry="2.5"></rect>
                 </svg>
                 <span id="${element['key']}-completed-task"> </span>
            </span>
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
    let assignedPeople = element['assignedTo'].slice(0, 5);
    let additionalPeopleCount = element['assignedTo'].length - 5;

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

    if (additionalPeopleCount > 0) {
        assignedToHTML += `
        <div class="assigned-person">
            <div class="circle ml-16" style="background-color: #ccc">+${additionalPeopleCount}</div>
        </div>
        `;
    }

    return assignedToHTML;
}


function assignedToAllContactsHTML(key) {
    let assignedPeopleContainer = '';
    let assignedPeople = allTasks[0][key]['assignedTo'];

    if (assignedPeople) {
        assignedPeople.forEach(p => {
            let initials = getFirstAndLastInitials(p['fullname']);
            let fullName = p['fullname'];

            assignedPeopleContainer += `
            <div class="assigned-person">
                <div class="assigned-to-popup">
                    <div class="circle ml-16" style="background-color: ${p['color']}">${initials}</div>
                    <div > ${fullName} </div>
                </div>
            </div>`
        })
    }

    return assignedPeopleContainer;
}