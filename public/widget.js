const newWidget = document.getElementById("new-widget");
const addWidgets = document.getElementById("add-widgets");
const widgetsList = document.getElementById("widgets-list");

newWidget.addEventListener("click", function (event) {
	addWidgets.showModal();
});
async function getWidgets() {
	const url = "widgets.json";

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const widgetsJSON = await response.json();

		console.log(widgetsJSON);
	} catch (error) {
		console.error(error.message);
	}
}

getWidgets();
for (let i = 0; i < widgetsJSON.length; i++) {}
