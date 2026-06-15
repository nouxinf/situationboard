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
	refreshCatpic.addEventListener("click", () => {
		refreshImage(catpicImage);
	});
	catpicImage.addEventListener("click", () => {
		zoomedCatpicImage.src = catpicImage.src;
		zoomedCatpicDialog.showModal();
	});
	const instanceId = container.dataset.instanceId; // set during creation in reconcile()
	// attach event listeners to these control buttons
	container
		.querySelector(".move-left")
		.addEventListener("click", () => moveWidgetLeft(instanceId));
	container
		.querySelector(".move-right")
		.addEventListener("click", () => moveWidgetRight(instanceId));
	container
		.querySelector(".delete-widget")
		.addEventListener("click", () => deleteWidget(instanceId));
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

function destroyCatpic(container) {}
