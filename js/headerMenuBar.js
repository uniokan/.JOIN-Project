setTimeout(function() {
    function dropDownMenu() {
        const toggle = document.getElementById("dropdown-toggle");
        const dropdown = document.getElementById("dropdown");

        toggle.addEventListener("click", function() {
            dropdown.classList.toggle("show");
        });

        document.addEventListener("click", function(event) {
            if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
                dropdown.classList.remove("show");
            }
        });
    }

    dropDownMenu();
}, 100);

