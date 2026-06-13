// const newWidget = document.getElementById("new-widget"); /* commented this bc its gonna be dynamically loaded */
const addWidgets = document.getElementById("add-widgets");
const widgetsList = document.getElementById("widgets-list");
let widgetsJSON = [];
let widgetAddDiv;
const addNewWidgetHTML = /* HTML */ ` <li>
	<div
		id="new-widget"
		class="widget"
	>
		<ul>
			<li>
				<img
					id="plus-icon"
					src="icons/plus.svg"
				/>
			</li>
			<li><span>Add a new widget</span></li>
		</ul>
	</div>
</li>`;

/*newWidget.addEventListener("click", function (event) { /* commented this bc its gonna be dynamically loaded */ /*
	addWidgets.showModal();
});
*/
async function getWidgets() {
	const url = "widgets.json";

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		widgetsJSON = await response.json();

		console.log(widgetsJSON);
		return widgetsJSON;
	} catch (error) {
		console.error(error.message);
	}
}

function lighter(colorName, whitePercent = 20) {
	return `color-mix(in srgb, ${colorName}, white ${whitePercent}%)`;
}

getWidgets().then(() => {
	for (let obj of widgetsJSON) {
		const widgetAddDiv = document.createElement("div");
		widgetAddDiv.innerHTML = /* HTML */ `
			<div
				class="widget-icon-wrapper"
				style="border-color:${obj.colour}; border-width: 1px; background-color: ${lighter(
					obj.colour,
					85,
				)};"
			>
				<div
					class="widget-icon"
					style="background-color:${obj.colour};mask:url('icons/${obj.icon}') no-repeat center;"
				></div>
			</div>
			<span class="widget-add-div-name">${obj.name}</span>
			<button class="add-widget-button"></button>
		`; // the html comment forces prettier to format this as html
		widgetAddDiv.style = `border-width: 2px; border-color: gray; border-style: solid; height: 40px; display: flex; align-items: center;`;
		widgetsList.appendChild(widgetAddDiv);
	}
});
