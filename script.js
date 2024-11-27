const navBar = document.querySelector("nav"),
      menuBtns = document.querySelectorAll(".menu-icon"),
      overlay = document.querySelector(".overlay");

menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
        navBar.classList.toggle("open");
    });
});

overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
});

document.getElementById('logout').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            window.location.href = '/login';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const headerToggle = document.getElementById('header-toggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const themeButton = document.getElementById('theme-button');

    // Toggle sidebar
    headerToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show-sidebar');
        main.style.marginLeft = sidebar.classList.contains('show-sidebar') ? '280px' : '0';
    });

    // Close sidebar when clicking outside
    main.addEventListener('click', () => {
        if (sidebar.classList.contains('show-sidebar')) {
            sidebar.classList.remove('show-sidebar');
            main.style.marginLeft = '0';
        }
    });

    // Toggle theme
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeButton.classList.toggle('ri-sun-line');
        themeButton.classList.toggle('ri-moon-clear-fill');
    });

    // Set user information
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    
    // You should replace this with actual user data from your session
    userName.textContent = 'John Doe';
    userEmail.textContent = 'john@example.com';
});