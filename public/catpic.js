let refreshHandler,
	zoomHandler,
	moveLeftHandler,
	moveRightHandler,
	deleteHandler;
let currentImgEl;

async function initCatpic(container) {
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
		<h3>Cat picture</h3>
		<img id="catpic-image" />
		<button id="refresh-catpic">New image</button>
	`;
	const refreshCatpic = container.querySelector("#refresh-catpic");
	const catpicImage = container.querySelector("#catpic-image");
	const zoomedCatpicImage = document.getElementById("zoomed-catpic");
	const zoomedCatpicDialog = document.getElementById("catpic-zoom");
	refreshHandler = () => refreshImage(catpicImage);
	zoomHandler = () => {
		zoomedCatpicImage.src = catpicImage.src;
		zoomedCatpicDialog.showModal();
	};

	refreshCatpic.addEventListener("click", refreshHandler);
	catpicImage.addEventListener("click", zoomHandler);

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

	await refreshImage(catpicImage);
}
async function refreshImage(imgEl) {
	const res = await fetch(`https://cataas.com/cat?${Date.now()}`, {
		credentials: "omit",
	});
	const blob = await res.blob();
	if (imgEl.src) URL.revokeObjectURL(imgEl.src);
	imgEl.src = URL.createObjectURL(blob);
}

function destroyCatpic(container) {
	if (currentImgEl?.src) {
		URL.revokeObjectURL(currentImgEl.src);
	}
	// remove listeners to save memory
	const refreshCatpic = container.querySelector("#refresh-catpic");
	const catpicImage = container.querySelector("#catpic-image");
	refreshCatpic?.removeEventListener("click", refreshHandler);
	catpicImage?.removeEventListener("click", zoomHandler);
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
	currentImgEl = null;
}
