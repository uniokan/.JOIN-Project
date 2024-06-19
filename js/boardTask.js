const BASE_URL = "https://join-project-abb83-default-rtdb.europe-west1.firebasedatabase.app/";

function init(){
    getDataFromDatabase();
    getTasks();
}

async function getDataFromDatabase(){
    let response = await fetch(BASE_URL + "task/" + ".json");
    let responseToJson = await response.json();

    return responseToJson;
}

function getTasks(){
    getToDoTasks();
}

async function getToDoTasks(){
    let toDo = await getDataFromDatabase();
    toDo= toDo['todo'];
    let container = document.getElementById('to-do-container');
    container.innerHTML='';
    toDo.forEach(todo =>{
        container.innerHTML+=`
        <div class="task-smallview">
            <span class="task-smallview-title" id="category">${todo['category']}</span>
            <h3 id="title">${todo['title']}</h3>
            <span class="lightgray" id="description">${todo['description']}</span>
            <span id="subtask">......... 1/2 Subtasks</span>
            <div class="space-between">
                <span id="name">AB</span>
                <img src="img/add_task_img/${todo['prio']}.png">
            </div>

        </div>
            `;
    })
}