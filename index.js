const express = require("express");
const app = express();
const port = 3055;

app.use(express.static("public"));

app.listen(port, () => {
	console.log(`Situationboard listening on port ${port}`);
	console.log(`Open it up at http://localhost:${port}`);
});
