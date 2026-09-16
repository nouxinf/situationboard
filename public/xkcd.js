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
		><button class="latest-button">Latest</button
		><button class="next-button">Next</button>
		<button class="random-button">Random</button>
		<input
			type="number"
			class="manual-id"
			placeholder="Go to Comic Number"
		/><button class="set-id-button">Go</button>
	`;

	let currentData = null;
	let latestNum = null;

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

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

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
			latestNum = result.num;
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
		let previousNum = currentData.num - 1;
		if (previousNum < 1) {
			previousNum = latestNum;
		}
		const previousData = await getComicByNum(previousNum);

		renderComic(previousData);
	}

	async function loadNextComic() {
		if (!currentData) {
			return;
		}
		let nextNum = currentData.num + 1;
		if (nextNum > latestNum) {
			nextNum = 1;
		}
		nextData = await getComicByNum(nextNum);
		renderComic(nextData);
	}

	async function loadRandomComic() {
		if (!currentData) {
			return;
		}
		let randomNum = getRandomInt(latestNum) + 1;
		randomData = await getComicByNum(randomNum);
		renderComic(randomData);
	}

	container
		.querySelector(".previous-button")
		.addEventListener("click", loadPreviousComic);
	container
		.querySelector(".next-button")
		.addEventListener("click", loadNextComic);
	container
		.querySelector(".random-button")
		.addEventListener("click", loadRandomComic);
	container
		.querySelector(".set-id-button")
		.addEventListener("click", async () => {
			const idInTextBox = parseInt(
				container.querySelector(".manual-id").value,
			);
			if (idInTextBox > latestNum || idInTextBox < 1) {
				alert(`Comic ID can't be below 1 or above ${latestNum}`);
			} else {
				const idInTextBoxData = await getComicByNum(idInTextBox);
				renderComic(idInTextBoxData);
			}
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
