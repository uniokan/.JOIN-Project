function updateAndShowDetailsHTML(initials,name, email, tel, randomColor, key){
    return  ` <div class="contactCardName">
    <div class="circleContactCard" style="background-color: ${randomColor};">${initials}
    </div>

    <div class="contactName">
        <p>${name}</p>
        <div class="contactNameEdit">
           <div class="edit-del-btn"> 
                <span onclick="openEditContact('${key}')">Edit</span>
                <img src="./img/add_task_img/edit.png">
            </div>
            <div class="edit-del-btn">
                <span onclick="deleteContact('${key}')">Delete</span>
                <img src="./img/add_task_img/delete.png">
            </div>
        </div>
    </div>
</div>

<div class="contactCardInfo">Contact Information</div>

<div class="contactCardEmail">
    <p>Email</p>
    <a id="${key}-tel" href="mailto: ${email}">${email}</a>

    <p>Phone</p>
    <a href="tel:${tel}">${tel}</a>
</div>`
}