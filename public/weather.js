let map;
let markedLatLon;
let activeInstanceId = null;
let activeContainer = null;
let confirmListenerAttached = false;

function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		(text) =>
			text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
	);
}

function getDayLabel(date, locale = navigator.language) {
	const now = new Date();
	const target = new Date(date);

	const diff = Math.round(
		(Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) -
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) /
			86400000,
	);

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	const dtf = new Intl.DateTimeFormat(locale, { weekday: "long" });

	if (diff === 0 || diff === 1) {
		return toTitleCase(rtf.format(diff, "day"));
	}

	return toTitleCase(dtf.format(target));
}

document
	.getElementById("save-weather-settings")
	.addEventListener("click", () => {
		localStorage.setItem(
			"temp-units",
			document.getElementById("temp-units").value === "fahrenheit"
				? "F"
				: "C",
		);

		document.querySelectorAll(".weather-widget").forEach((container) => {
			const instanceId = container.dataset.instanceId;
			const widgetData = getWidgetData(instanceId);

			if (widgetData.weather) {
				updateWeather(container, widgetData.weather);
			}
		});
		window.location.reload();
	});

function initWeather(container) {
	async function getWeatherData(lat, lon) {
		const url = `/api/weather?lat=${lat}&lon=${lon}`;
		try {
			const response = await fetch(url);
			console.log("fetched weather data");
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
			weatherData = await response.json();
			return weatherData;
		} catch (error) {
			console.error(error.message);
		}
	}
	const data = getWidgetData(container.dataset.instanceId);
	container.innerHTML =
		/* HTML */
		`
			<div class="widget-controls">
				<button
					class="widget-control move-left"
					title="Move left"
				></button>
				<button
					class="widget-control move-right"
					title="Move right"
				></button>
				<button
					class="widget-control settings-icon"
					title="Settings"
				></button>
				<button
					class="widget-control delete-widget"
					title="Delete"
				></button>
			</div>

			<strong
				><span
					class="weather-location"
					lang="en"
					>Loading...</span
				></strong
			>
			<img
				src="icons/pencil.svg"
				class="pick-location-btn"
			/>
			<h2 class="monospace oilpricecurrency temperature"></h2>

			<details>
				<summary>View raw data</summary>
				<pre class="raw-weather-data"></pre>
			</details>
			<table class="forecast-table">
				<tr>
					<td>Today</td>
					<td></td>
				</tr>
				<tr>
					<td>Tomorrow</td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
				</tr>
			</table>
		`;
	const instanceId = container.dataset.instanceId;

	moveLeftHandler = () => moveWidgetLeft(instanceId);
	moveRightHandler = () => moveWidgetRight(instanceId);
	deleteHandler = () => deleteWidget(instanceId);
	settingsHandler = () =>
		document.getElementById("weather-settings").showModal();

	const weatherSelectDialog = document.getElementById("weather-select");
	var map;

	container
		.querySelector(".move-left")
		.addEventListener("click", moveLeftHandler);
	container
		.querySelector(".move-right")
		.addEventListener("click", moveRightHandler);
	container
		.querySelector(".delete-widget")
		.addEventListener("click", deleteHandler);
	container
		.querySelector(".settings-icon")
		.addEventListener("click", settingsHandler);
	container
		.querySelector(".pick-location-btn")
		.addEventListener("click", () => {
			activeInstanceId = container.dataset.instanceId;
			activeContainer = container;
			markedLatLon = null; // reset selection for this session
			weatherSelectDialog.showModal();
			if (!map) {
				map = L.map("map").setView([51.505, -0.09], 13);
				L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
					maxZoom: 19,
					attribution:
						'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				}).addTo(map);
				const marker = L.marker();
				function onMapClick(e) {
					marker.setLatLng(e.latlng).addTo(map);
					markedLatLon = [e.latlng.lat, e.latlng.lng];
					console.log("clicked map", markedLatLon);
				}
				map.on("click", onMapClick);
			} else {
				map.invalidateSize();
			}
			setTimeout(() => map.invalidateSize(), 0);
		});

	if (!confirmListenerAttached) {
		confirmListenerAttached = true;
		const confirmWeatherSelect = document.getElementById(
			"confirm-weather-select",
		);
		confirmWeatherSelect.addEventListener("click", () => {
			if (markedLatLon == null) {
				alert("Error: No location selected");
				console.log(markedLatLon);
			} else {
				getWeatherData(markedLatLon[0], markedLatLon[1]).then(
					(weatherData) => {
						setWidgetData(activeInstanceId, {
							location: markedLatLon,
							weather: weatherData, // Cache the data here
						});
						updateWeather(activeContainer, weatherData);
					},
				);
			}
		});
	}

	if (
		data.location != null &&
		(!Array.isArray(data.location) || data.location.length > 0)
	) {
		getWeatherData(data.location[0], data.location[1]).then(
			(weatherData) => {
				setWidgetData(instanceId, {
					...data,
					weather: weatherData,
				});
				updateWeather(container, weatherData);
			},
		);
	}
}
function updateWeather(container, data) {
	console.log("weather updated");
	let stringifiedData = JSON.stringify(data);
	const rawData = container.querySelector(".raw-weather-data");
	const locationText = container.querySelector(".weather-location");
	const tempText = container.querySelector(".temperature");
	rawData.innerText = stringifiedData;
	locationText.innerText = data.place;
	const storedUnits = localStorage.getItem("temp-units");
	const fallbackUnits =
		document.getElementById("temp-units").value === "fahrenheit"
			? "F"
			: "C";
	const units = storedUnits ?? fallbackUnits;

	const temperature =
		units === "F"
			? Math.round((data.current.temperature * 1.8 + 32) * 10) / 10
			: Math.round(data.current.temperature * 10) / 10;
	tempText.innerText = `${temperature}°${units}`;
	console.log(Math.round(data.current.temperature * 10) / 10);
	console.log(data);
	const date = new Date();
	// forecast
	for (let i = 0; i < 7; i++) {
		let rows =
			container.querySelector(".forecast-table").firstElementChild
				.children;
		let itemsInRow = rows.item(i);
		// console.log(rows);
		// console.log(itemsInRow);
		console.log(itemsInRow.children.item(0));

		itemsInRow.children.item(0).textContent = getDayLabel(date);
		date.setDate(date.getDate() + 1);
	}
}
function destroyWeather(container) {
	container
		.querySelector(".move-left")
		?.removeEventListener("click", moveLeftHandler);
	container
		.querySelector(".move-right")
		?.removeEventListener("click", moveRightHandler);
	container
		.querySelector(".delete-widget")
		?.removeEventListener("click", deleteHandler);
	container
		.querySelector(".settings-icon")
		?.removeEventListener("click", settingsHandler);
	moveLeftHandler = moveRightHandler = deleteHandler = null;
}
