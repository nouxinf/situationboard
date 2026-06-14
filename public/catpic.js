async function initCatpic(container) {
	container.innerHTML = /* HTML */ `
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
