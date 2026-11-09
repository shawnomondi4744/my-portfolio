const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("murkx-theme");

if (savedTheme === "dark") {
document.body.classList.add("dark-mode");
}

function updateThemeButton() {
if (!themeToggle) return;


if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️ Light Mode";
} else {
    themeToggle.textContent = "🌙 Dark Mode";
}


}

if (themeToggle) {
updateThemeButton();


themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("murkx-theme", "dark");
    } else {
        localStorage.setItem("murkx-theme", "light");
    }

    updateThemeButton();
});


}
