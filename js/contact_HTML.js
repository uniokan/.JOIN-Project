function updateAndShowDetailsHTML(initials,name, email, tel, randomColor, key){
    return  ` <div class="contactCardName">
    <div class="circleContactCard" style="background-color: ${randomColor};">${initials}
    </div>

    <div class="contactName">
        <p>${name}</p>
        <div class="contactNameEdit">
            <span onclick="openEditContact('${key}')">Edit</span>
            <span onclick="deleteContact('${key}')">Delete</span>
        </div>
    </div>
</div>

<div class="contactCardInfo">Contact Information</div>

<div class="contactCardEmail">
    <p>Email</p>
    <a href="mailto: ${email}">${email}</a>

    <p>Phone</p>
    <a href="tel:${tel}">${tel}</a>
</div>`
}