const addWidgets = document.getElementById("add-widgets");
const widgetsList = document.getElementById("widgets-list");
const widgetsContainer = document.getElementById("widgets");
let widgetsJSON = [];
let widgetAddDiv;
let userWidgets;

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

if (localStorage.getItem("situationboard-widgets") == null) {
	userWidgets = ["catpic"];
} else {
	userWidgets = JSON.parse(localStorage.getItem("situationboard-widgets"));
}

const widgetRegistry = {
	catpic: { init: initCatpic, destroy: destroyCatpic }, // destroy cat 😡
};

const widgetElements = new Map();
// called when userWidgets changes
function reconcile() {
	// remove widgets that are no longer in userWidgets
	for (const [id, el] of widgetElements) {
		if (!userWidgets.includes(id)) {
			widgetRegistry[id]?.destroy(el);
			el.closest("li").remove();
			widgetElements.delete(id);
		}
	}

	// create or reorder to match userWidgets
	userWidgets.forEach((id, index) => {
		let el = widgetElements.get(id);

		if (!el) {
			const li = document.createElement("li");
			el = document.createElement("div");
			el.dataset.widget = id;
			el.classList.add("widget");
			el.classList.add("real-widget");
			widgetsContainer.appendChild(el);
			li.appendChild(el);
			widgetsContainer.appendChild(li);
			widgetElements.set(id, el);
			widgetRegistry[id]?.init(el);
		}

		// move to correct slot if order is wrong
		const slots = [...widgetsContainer.children];
		if (slots[index] !== el) {
			widgetsContainer.insertBefore(el, slots[index] ?? null);
		}
	});

	localStorage.setItem("situationboard-widgets", JSON.stringify(userWidgets));
}

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
		`;
		widgetAddDiv.style = `border-width: 2px; border-color: gray; border-style: solid; height: 40px; display: flex; align-items: center;`;
		widgetsList.appendChild(widgetAddDiv);
	}
});

reconcile();
