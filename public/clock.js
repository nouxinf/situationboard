function initClock(container) {
	console.log("init clock");
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
		<h3 class="monospace clock-time">Loading...</h3>
		<span class="minor-text clock-date"></span>
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

	function ordinal_suffix_of(i) {
		let j = i % 10,
			k = i % 100;
		if (j === 1 && k !== 11) {
			return i + "st";
		}
		if (j === 2 && k !== 12) {
			return i + "nd";
		}
		if (j === 3 && k !== 13) {
			return i + "rd";
		}
		return i + "th";
	}

	function updateTime() {
		let d = new Date();
		let s = d.getSeconds();
		let m = d.getMinutes();
		let h = d.getHours();
		let dayName = d.toLocaleDateString(undefined);
		container.querySelector(".clock-time").innerText =
			("0" + h).substr(-2) +
			":" +
			("0" + m).substr(-2) +
			":" +
			("0" + s).substr(-2);
		container.querySelector(".clock-date").innerText = dayName;
	}
	setInterval(updateTime, 1000);
}

function destroyClock(container) {
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
