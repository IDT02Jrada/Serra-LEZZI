document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.querySelector(".sidebar .logout-btn a");
    const logoutDialog = document.getElementById("logoutDialog");
    const confirmLogoutButton = document.getElementById("confirmLogout");
    const cancelLogoutButton = document.getElementById("cancelLogout");

    logoutButton.addEventListener("click", function(event) {
        event.preventDefault();
        logoutDialog.style.display = "flex";
    });

    confirmLogoutButton.addEventListener("click", function() {
        window.location.href = "/login";
    });

    cancelLogoutButton.addEventListener("click", function() {
        logoutDialog.style.display = "none";
    });
});