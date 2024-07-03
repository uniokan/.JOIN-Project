document.addEventListener('DOMContentLoaded', function () {
    let hideElements = localStorage.getItem('hideElements');
    if (hideElements === 'true') {
        let sidebar = document.getElementById('sidebar');
        let mainContent = document.getElementById('main-content');
        let dropdown = document.getElementById('dropdown-toggle');
        let content = document.getElementById('contentPolicys');

        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
        if (dropdown) dropdown.style.display = 'none';
        
        if (content) {
            content.style.margin = '0';
            content.style.margin = '30px';
        }

        localStorage.removeItem('hideElements');
    }
});