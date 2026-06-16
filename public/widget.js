const addWidgets = document.getElementById("add-widgets");
const widgetsList = document.getElementById("widgets-list");
const widgetsContainer = document.getElementById("widgets");
let widgetsJSON = [];
let userWidgets;

// unique id
let nextInstanceId = Date.now();
function generateInstanceId() {
	return `widget-${nextInstanceId++}`;
}

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
	userWidgets = [{ instanceId: generateInstanceId(), type: "catpic" }];
} else {
	const stored = JSON.parse(localStorage.getItem("situationboard-widgets"));
	// Migrate old string format if present
	if (stored.length > 0 && typeof stored[0] === "string") {
		userWidgets = stored.map((type) => ({
			instanceId: generateInstanceId(),
			type,
		}));
	} else {
		userWidgets = stored;
	}
}

const widgetRegistry = {
	catpic: { init: initCatpic, destroy: destroyCatpic },
	oilprice: { init: initOilprice, destroy: destroyOilprice },
};

const widgetElements = new Map(); // key: instanceId, value: container div

// Attach listener for the "Add a new widget" button (reused whenever button is recreated)
function attachNewWidgetListener() {
	const newWidget = document.getElementById("new-widget");
	if (newWidget) {
		const newWidgetFresh = newWidget.cloneNode(true);
		newWidget.replaceWith(newWidgetFresh);
		newWidgetFresh.addEventListener("click", () => {
			addWidgets.showModal();
		});
	}
}

async function reconcile() {
	for (const [instanceId, el] of widgetElements) {
		const stillExists = userWidgets.some(
			(w) => w.instanceId === instanceId,
		);
		if (!stillExists) {
			const type = el.dataset.widget; // stored during creation
			widgetRegistry[type]?.destroy(el);
			el.closest("li").remove();
			widgetElements.delete(instanceId);
		}
	}

	userWidgets.forEach((widget, index) => {
		const { instanceId, type } = widget;
		let el = widgetElements.get(instanceId);

		if (!el) {
			const li = document.createElement("li");
			el = document.createElement("div");
			el.dataset.instanceId = instanceId;
			el.dataset.widget = type; // keep for destroy & identification
			el.classList.add("widget", "real-widget");

			li.appendChild(el);
			widgetsContainer.appendChild(li);
			widgetElements.set(instanceId, el);
			widgetRegistry[type]?.init(el);
		}

		// move to correct position based on index
		const children = [...widgetsContainer.children];
		const currentLi = el.closest("li");
		if (children[index] !== currentLi) {
			widgetsContainer.insertBefore(currentLi, children[index] ?? null);
		}
	});

	localStorage.setItem("situationboard-widgets", JSON.stringify(userWidgets));

	if (!document.getElementById("new-widget")) {
		widgetsContainer.insertAdjacentHTML("beforeend", addNewWidgetHTML);
		attachNewWidgetListener();
	}
}

// fetch available widget definitions from JSON
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
		widgetAddDiv.classList = "widget-add-div";
		// attach click handler to add a new instance of this widget type
		const button = widgetAddDiv.querySelector(".add-widget-button");
		button.addEventListener("click", () => {
			userWidgets.push({
				instanceId: generateInstanceId(),
				type: obj.id,
			});
			reconcile(); // immediately update the DOM
		});

		widgetsList.appendChild(widgetAddDiv);
	}
});
function deleteWidget(instanceId) {
	userWidgets = userWidgets.filter((w) => w.instanceId !== instanceId);
	reconcile();
}

function moveWidgetLeft(instanceId) {
	const index = userWidgets.findIndex((w) => w.instanceId === instanceId);
	if (index > 0) {
		// swap with previous widget
		[userWidgets[index], userWidgets[index - 1]] = [
			userWidgets[index - 1],
			userWidgets[index],
		];
		reconcile();
	}
}

function moveWidgetRight(instanceId) {
	const index = userWidgets.findIndex((w) => w.instanceId === instanceId);
	if (index < userWidgets.length - 1) {
		// swap with next widget
		[userWidgets[index], userWidgets[index + 1]] = [
			userWidgets[index + 1],
			userWidgets[index],
		];
		reconcile();
	}
}
reconcile().then(() => {
	attachNewWidgetListener();
});
