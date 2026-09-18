const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
if (localStorage.getItem("theme") === "dark" || systemSettingDark.matches) {
	document.documentElement.setAttribute("data-theme", "dark");
	localStorage.setItem("theme", "dark");
}
