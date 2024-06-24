// const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

const toDo = 'todo';
const inProgress = 'inprogress';
const awaitFeedback = 'feedback';
const done = 'done';
let allTasks = [];
let currentDraggedElement;
idCounter = 0;
let allKeys = [];
let allTasksJson = [];
let assignedToJson = [];
let currentKey;
let editTaskOpen = false;
let orginalContent;


async function init() {
    await getDataFromDatabaseByStart();
    checkLoginStatusAndRedirect();
    updateHTML();
}


async function getDataFromDatabaseByStart() {
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();

    allTasks.push(responseToJson);

    getKeys();
    generateJsonObjects();
}


function getKeys() {
    let keysArray = Object.keys(allTasks[0]);
    for (let i = 0; i < keysArray.length; i++) {
        allKeys.push(keysArray[i]);
    }
}


function updateHTML() {
    filterAllTasks(toDo);
    filterAllTasks(inProgress);
    filterAllTasks(awaitFeedback);
    filterAllTasks(done);
}


function generateJsonObjects() {
    allTasks.forEach(taskGroup => {
        Object.values(taskGroup).forEach(jsonObject => {
            allTasksJson.push(jsonObject);
        });
    });

    for (let i = 0; i < allKeys.length; i++) {
        allTasksJson[i]['key'] = allKeys[i];
    }
}


function filterAllTasks(step) {
    let container = document.getElementById(`${step}-container`);

    let category = allTasksJson.filter(c => c['step'] == `${step}`);


    container.innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        let element = category[i];
        container.innerHTML += gererateTaskHTML(element);
    }

    checkUserStoryOrTechnical();
}


function checkUserStoryOrTechnical() {
    let title = document.querySelectorAll('.task-smallview-title');

    title.forEach(titleText => {
        if (titleText.innerText == 'Technical Task') {
            titleText.style.backgroundColor = 'rgb(30, 214, 193)';
        }
    })
}


function gererateTaskHTML(element) {
    let reducedText = '';
    let assignedToHTML = '';

    if (element['assignedTo'] != null) {
        assignedToHTML = generateAssignedToHTML(element);
    }

    if (element['description'] != null) {
        reducedText = reducedDescriptionText(element);
    }

    return `
         <div id="${element['key']}" onclick="openPopUp('task-pop-up', '${element['key']}');  closePopUpOutsideContainer('task');" class="task-smallview" draggable="true" ondragstart="startDragging('${element['key']}')">
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


function reducedDescriptionText(element) {
    let getText = element['description'];
    let maxLength = 50;

    if (getText.length <= maxLength) {
        return getText;
    }

    else if (getText.length >= maxLength) {
        return getText.slice(0, maxLength) + '...'
    }
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



function startDragging(key) {
    currentDraggedElement = allTasksJson.findIndex(task => task.key === key);
}


function allowDrop(event) {

    event.preventDefault();
}


async function moveTo(category) {
    allTasksJson[currentDraggedElement]['step'] = category;
    let changedStep = allTasksJson[currentDraggedElement];
    let getKey = allTasksJson[currentDraggedElement]['key'];

    let container = document.getElementById(`${category}-container`);
    container.classList.remove('container-highlight');

    await pushChangedTaskToDatabase(changedStep, getKey);
    updateHTML();
}


async function pushChangedTaskToDatabase(task, key) {
    await fetch(BASE_URL + "task/" + key + "/" + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
}


function openPopUp(html, key) {
    currentKey = key;

    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${html}`);
    let sidebar = document.getElementById('sidebar_addtask');
    let addTaskMain = document.querySelector('.add-task-main');

    content.classList.remove('d-none');
    backgroundDim.classList.add('background-dim');
    addTaskPopUp.classList.remove('pop-up-hidden');
    addTaskPopUp.classList.add('pop-up-100vh');
    sidebar.classList.add('d-none');
    addTaskMain.style.margin = 0;
    addTaskMain.style.padding = '40px';


    getTextForPopUp(key);
}


function getTextForPopUp(key) {
    let getTitle = document.getElementById(`${key}-title`).innerText;
    let getDescription = allTasks[0][key]['description'];
    let getCategory = document.getElementById(`${key}-category`).innerText;
    let getPrio = allTasks[0][key]['prio'];
    let getAssignedto = document.getElementById(`${key}-assignedto`).innerHTML;
    let getDate = allTasks[0][key]['date'];
    let getSubtask = allTasks[0][key]['subtask'];
    let subtasks = [];

    getSubtask.forEach(sub => subtasks.push(sub));

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = getAssignedto;

    let assignedtoFullNames = tempDiv.querySelectorAll('.assigned-person .d-none');
    assignedtoFullNames.forEach(div => div.classList.remove('d-none'));
    let assignedtoHTML = Array.from(tempDiv.querySelectorAll('.assigned-person')).map(div => div.innerHTML).join('');

    showCurrentInfoInPopUp(getTitle, getDescription, getCategory, subtasks, getPrio, assignedtoHTML, getDate);
}


function showCurrentInfoInPopUp(title, description, category, subtask, prio, assignedto, date) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-description').innerHTML = description;
    document.getElementById('popup-category').innerHTML = category;
    document.getElementById('popup-subtask').innerHTML = subtask;
    document.getElementById('popup-prio').innerHTML = prio.toUpperCase();
    document.getElementById('popup-assignedto').innerHTML = assignedto;
    document.getElementById('popup-date').innerHTML = date;

}


function closePopUp(select) {
    let backgroundDim = document.getElementById('background-dim');
    let addTaskPopUp = document.getElementById('add-task-pop-up');
    let content = document.getElementById(`${select}-pop-up`)

    content.classList.add('d-none');
    backgroundDim.classList.remove('background-dim');
    addTaskPopUp.classList.remove('pop-up-100vh');
    addTaskPopUp.classList.add('pop-up-hidden');

}


function closePopUpOutsideContainer(select) {
    let backgroundDim = document.getElementById('background-dim');
    let popUp = document.getElementById('add-task-pop-up');

    backgroundDim.addEventListener('click', event => {
        if (!popUp.contains(event.target)) {
            closePopUp(select);
            if (editTaskOpen) {
                changeEditTaskToStandardText();
                false;
            }
        }
    });

    backgroundDim.addEventListener('mousemove', event => {
        if (popUp.contains(event.target)) {
            backgroundDim.style.cursor = 'unset';
        }

        else {
            backgroundDim.style.cursor = 'pointer';
        }
    });

   
}

async function deleteTask(container) {
    await fetch(BASE_URL + "task/" + currentKey + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    let element = document.getElementById(currentKey);
    closePopUp(container);
    element.remove();
}

function highlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.add('container-highlight');
}

function stopHighlight(containerId) {
    let container = document.getElementById(containerId.toString());

    container.classList.remove('container-highlight');
}


function changeEditTaskToStandardText(){
    let standardContainer = document.getElementById('task-overlay-content');
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.remove('d-none');
    standardContainer.innerHTML=orginalContent;
}

function openEditTask() {
    let standardContainer = document.getElementById('task-overlay-content');
    let editDelBtn = document.getElementById('edit-delete-container');
    editDelBtn.classList.add('d-none');
    editTaskOpen = true;
    orginalContent=standardContainer.innerHTML;


    standardContainer.innerHTML = `<div class="taskSelect">
                <div class="taskSelectContainer"></div>
                <div class="close"><img src="./img/taskOverlay_img/close.svg" alt="" /></div>
            </div>

            <div class="container">
                <div class="">Title</div>
                <input type="text" />
            </div>
            <div class="container">
                <div class="">Description</div>
                <textarea type="text">Build start page with recipe recommendation.</textarea>
            </div>

            <div class="container">
                <div class="">Due date</div>
                <input type="date" />
            </div>

            <div class="container">
                <div class="">Priority</div>
                <div class="buttonContainer">
                    <button class="priorityButton">
                        Urgent<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                                fill="#FF3D00"
                            />
                            <path
                                d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                                fill="#FF3D00"
                            />
                        </svg>
                    </button>
                    <button class="priorityButton">
                        Medium<svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_156_1016)">
                                <path
                                    d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                                    fill="#FFA800"
                                />
                                <path
                                    d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                                    fill="#FFA800"
                                />
                            </g>
                            <defs>
                                <clippath id="clip0_156_1016">
                                    <rect width="20" height="7.45098" fill="white" transform="translate(0.855469 0.466064)" />
                                </clippath>
                            </defs>
                        </svg>
                    </button>
                    <button class="priorityButton">
                        Low<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z"
                                fill="#7AE229"
                            />
                            <path
                                d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z"
                                fill="#7AE229"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="container">
                <div class="">Assigned To</div>
                <div class=""><input type="text" />das input Feld bekommt ein Drop Down Menü mit meinen Kontakten</div>
                <div class="batchContainer">
                    <div class="batch"></div>
                    <div class="batch"></div>
                    <div class="batch"></div>
                    <div class="batch"></div>
                    <div class="batch"></div>
                    <div class="batch"></div>
                </div>
            </div>

            <div class="container">
                <div class="">Subtasks</div>
                <div class=""><input type="text" />Hier werden neue Tasks geadded</div>
                <div class="">
                    <ul>
                        <li>Implement Recipe Recommendation</li>
                        <li>Start Page Layout</li>
                    </ul>
                </div>
            </div>

            <div class="okBtnContainer">
                <button class="okBtn">
                    Ok<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5.55057 9.65L14.0256 1.175C14.2256 0.975 14.4631 0.875 14.7381 0.875C15.0131 0.875 15.2506 0.975 15.4506 1.175C15.6506 1.375 15.7506 1.6125 15.7506 1.8875C15.7506 2.1625 15.6506 2.4 15.4506 2.6L6.25057 11.8C6.05057 12 5.81724 12.1 5.55057 12.1C5.28391 12.1 5.05057 12 4.85057 11.8L0.550573 7.5C0.350573 7.3 0.25474 7.0625 0.263073 6.7875C0.271407 6.5125 0.375573 6.275 0.575573 6.075C0.775573 5.875 1.01307 5.775 1.28807 5.775C1.56307 5.775 1.80057 5.875 2.00057 6.075L5.55057 9.65Z"
                            fill="white"
                        />
                    </svg>
                </button>
            </div>
       `;


}