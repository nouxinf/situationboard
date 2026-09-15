function initXkcd(container) {
	console.log("init xkcd");
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
		<img
			src=""
			id="comic-img"
		/>
	`;
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

	async function getCurrentComic() {
		const url = "/api/xkcd/current";
		try {
			const response = await fetch(url, {
				method: "GET",
			});
			if (!response.ok) {
				throw new Error(`Response Status: ${response.status}`);
			}

			const result = await response.json();
			return result;
		} catch (error) {
			console.error(error.message);
			throw error;
		}
	}
	getCurrentComic().then((currentData) => {
		console.log(currentData);
		container.querySelector("#comic-img").src = currentData.img;
	});
}

function destroyXkcd(container) {
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
