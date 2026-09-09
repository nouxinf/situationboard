let map;
let markedLatLon;
let activeInstanceId = null;
let activeContainer = null;
let confirmListenerAttached = false;

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
					class="widget-control delete-widget"
					title="Delete"
				></button>
			</div>

			<span
				class="weather-location"
				lang="en"
				>Loading...</span
			>
			<button class="pick-location-btn">Pick location</button>
			<pre class="raw-weather-data"></pre>
		`;
	const instanceId = container.dataset.instanceId;

	moveLeftHandler = () => moveWidgetLeft(instanceId);
	moveRightHandler = () => moveWidgetRight(instanceId);
	deleteHandler = () => deleteWidget(instanceId);
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
						'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
					(data) => {
						setWidgetData(activeInstanceId, {
							location: markedLatLon,
						});
						updateWeather(activeContainer, data);
					},
				);
			}
		});
	}

	if (
		data.location != null &&
		(!Array.isArray(data.location) || data.location.length > 0)
	) {
		getWeatherData(data.location[0], data.location[1]).then((data) => {
			updateWeather(container, data);
		});
	}
}
function updateWeather(container, data) {
	console.log("weather updated");
	let stringifiedData = JSON.stringify(data);
	const rawData = container.querySelector(".raw-weather-data");
	const locationText = container.querySelector(".weather-location");
	rawData.innerText = stringifiedData;
	locationText.innerText = data[1];
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

	moveLeftHandler = moveRightHandler = deleteHandler = null;
}
