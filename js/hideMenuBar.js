document.addEventListener('DOMContentLoaded', function () {
    const currentURL = window.location.href;
    const savedURL = localStorage.getItem('savedURL');
    const hideElements = localStorage.getItem('hideElements');

    if (hideElements === 'true') {
        let sidebar = document.getElementById('sidebar');
        let mainContent = document.getElementById('main-content');
        let dropdown = document.getElementById('dropdown-toggle');
        let content = document.getElementById('contentPolicys');
        let body = document.getElementById('body')

        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
        if (dropdown) dropdown.style.display = 'none';
        
        if (content) {
            content.style.margin = '0';
            content.style.margin = '30px';
            body.style.display = 'flex'
            body.style.flexDirection = 'column'
            body.style.alignItems = 'center'
            body.style.width = '100%'
        }
    }

    localStorage.setItem('savedURL', currentURL);
});

window.addEventListener('beforeunload', function () {
    const currentURL = window.location.href;
    const savedURL = localStorage.getItem('savedURL');

    if (currentURL !== savedURL) {
        localStorage.removeItem('hideElements');
        localStorage.removeItem('savedURL');
    }
});