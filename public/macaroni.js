const situationBoardSpan = document.getElementById("situationboard-macaroni");

situationBoardSpan.addEventListener("click", () => {
	window.location.reload();
});

const attributionSpan = document.getElementById("attribution-macaroni");
const attributionDialog = document.getElementById("attribution-dialog");
attributionSpan.addEventListener("click", () => {
	attributionDialog.showModal();
});
