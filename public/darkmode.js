const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
if (localStorage.getItem("theme") === "dark") {
	document.documentElement.setAttribute("data-theme", "dark");
	localStorage.setItem("theme", "dark");
} else if (localStorage.getItem("theme") === "light") {
	document.documentElement.setAttribute("data-theme", "light");
	localStorage.setItem("theme", "light");
} else {
	if (systemSettingDark.matches) {
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark");
	} else {
		localStorage.setItem("theme", "light");
	}
}

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
	const currentTheme = document.documentElement.getAttribute("data-theme");
	if (currentTheme === "dark") {
		document.documentElement.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light");
	} else {
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark");
	}
});
