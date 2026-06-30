function initWeather(container) {
	let weatherData;
	async function getWeatherData(lat, lon) {
		const url = `/api/weather?lat=${lat}&lon=${lon}`;
		try {
			const response = await fetch(url);
			console.log("fetched weather data");
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
			weatherData = await response.json();
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
			<button class="pick-location-btn">Pick location</button>
			<pre class="raw-weather-data"></pre>
		`;
	const instanceId = container.dataset.instanceId;
	let markedLatLon;
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
			weatherSelectDialog.showModal();
			if (!map) {
				var map = L.map("map").setView([51.505, -0.09], 13);
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
			}
			setTimeout(() => map.invalidateSize(), 0);
		});
	const confirmWeatherSelect = document.getElementById(
		"confirm-weather-select",
	);
	confirmWeatherSelect.addEventListener("click", () => {
		if (markedLatLon == null) {
			alert("Error: No location selected");
			console.log(markedLatLon);
		} else {
			getWeatherData(markedLatLon[0], markedLatLon[1]).then(() => {
				setWidgetData(container.dataset.instanceID, {
					location: markedLatLon,
				});
				updateWeather();
			});
		}
	});
	rawData = container.querySelector(".raw-weather-data");
	if (
		data.location != null &&
		(!Array.isArray(data.location) || data.location.length > 0)
	) {
		getWeatherData(data.location[0], data.location[1]).then(() => {
			updateWeather();
		});
	}
}
function updateWeather() {
	console.log("weather updated");
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
