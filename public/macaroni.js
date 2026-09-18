const situationBoardSpan = document.getElementById("situationboard-macaroni");

situationBoardSpan.addEventListener("click", () => {
	window.location.reload();
});

const attributionSpan = document.getElementById("attribution-macaroni");
const attributionDialog = document.getElementById("attribution-dialog");
attributionSpan.addEventListener("click", () => {
	attributionDialog.showModal();
});

const aboutSpan = document.getElementById("about-macaroni");
const aboutDialog = document.getElementById("about-dialog");
aboutSpan.addEventListener("click", () => {
	aboutDialog.showModal();
});
