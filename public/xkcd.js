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
		<h3 class="comic-num"></h3>
		<img
			src=""
			class="comic-img"
		/>
		<p><i class="alt-text"></i></p>
		<button class="previous-button">Previous</button
		><button class="latest-button">Latest</button><button>Next</button>
	`;

	let currentData = null;

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

	function renderComic(data) {
		currentData = data;
		container.querySelector(".comic-img").src = data.img;
		container.querySelector(".comic-num").textContent = `#${data.num}`;
		container.querySelector(".alt-text").textContent = data.alt;
	}

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

	async function getComicByNum(num) {
		const response = await fetch(`/api/xkcd/${num}`);

		if (!response.ok) {
			throw new Error(`Response Status: ${response.status}`);
		}

		return response.json();
	}

	async function loadCurrentComic() {
		currentData = await getCurrentComic();
		renderComic(currentData);
		return currentData;
	}
	loadCurrentComic();

	container.querySelector(".latest-button").addEventListener("click", () => {
		loadCurrentComic();
	});

	async function loadPreviousComic() {
		if (!currentData) {
			return;
		}
		const previousNum = currentData.num - 1;
		const previousData = await getComicByNum(previousNum);

		renderComic(previousData);
	}

	container
		.querySelector(".previous-button")
		.addEventListener("click", loadPreviousComic);
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
