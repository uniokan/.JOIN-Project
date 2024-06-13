document.addEventListener('DOMContentLoaded', () => {
    let dropimg = document.querySelector('.dropimg');
    let dropdownContent = document.querySelector('.dropdown-content');

    // Check Dropdown-Menu
    dropimg.addEventListener('click', () => {
        let onOrOff = dropdownContent.style.display === 'block';
        dropdownContent.style.display = onOrOff ? 'none' : 'block';

    });

    // Fügt Klick-Event-Listener zum gesamten Dokument hinzu
    document.addEventListener('click', (event) => {
        if (!dropimg.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropimg.classList.remove('gray-out');
        }
    });
});