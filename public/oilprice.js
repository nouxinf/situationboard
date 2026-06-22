function initOilprice(container) {
	let data;
	async function getOilData() {
		const url = "/api/oilprice";
		try {
			const response = await fetch(url);
			console.log("fetched oil price");
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
			data = await response.json();
		} catch (error) {
			console.error(error.message);
		}
	}
	getOilData().then(() => {
		// let lastUpdatedDate = new Date(data.data.updated_at);
		// let readableDate = `${lastUpdatedDate.getHours()}:${lastUpdatedDate.getMinutes()} ${lastUpdatedDate.getDate()} ${lastUpdatedDate.toLocaleString("default", { month: "long" })} ${lastUpdatedDate.getFullYear()}`;
		console.log(data.response.data[0].value);
		container.innerHTML = /* HTML */ `
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
			<h2 class="monospace oilpricecurrency">
				$${data.response.data[0].value}<img src="icons/oil.svg" />
			</h2>

			<span class="monospace minor-text"
				>${data.response.data[0]["product-name"]}</span
			>
			<p class="no-top-margin no-bottom-margin">
				Last updated
				<span
					class="tooltip"
					title="Due to limitations in the EIA API oil price is updated infrequently"
					>${data.response.data[0].period}
				</span>
			</p>
			<details>
				<summary>Open raw data</summary>
				<code>${JSON.stringify(data.response.data[0], null, 2)}</code>
			</details>
		`;
		console.log("added html");
		const instanceId = container.dataset.instanceId;
		moveLeftHandler = () => moveWidgetLeft(instanceId);
		moveRightHandler = () => moveWidgetRight(instanceId);
		deleteHandler = () => deleteWidget(instanceId);

		container
			.querySelector(".move-left")
			.addEventListener("click", moveLeftHandler);
		container
			.querySelector(".move-right")
			.addEventListener("click", moveRightHandler);
		container
			.querySelector(".delete-widget")
			.addEventListener("click", deleteHandler);
	});
}
function destroyOilprice(container) {
	refreshCatpic?.removeEventListener("click", refreshHandler);
	container
		.querySelector(".move-left")
		?.removeEventListener("click", moveLeftHandler);
	container
		.querySelector(".move-right")
		?.removeEventListener("click", moveRightHandler);
	container
		.querySelector(".delete-widget")
		?.removeEventListener("click", deleteHandler);

	refreshHandler =
		zoomHandler =
		moveLeftHandler =
		moveRightHandler =
		deleteHandler =
			null;
}
