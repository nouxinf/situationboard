import express from "express";
const app = express();
const port = 3055;

import oilPriceRoutes from "./routes/oilprice.js";

app.use(express.static("public"));
app.use("/api/oilprice", oilPriceRoutes);

app.listen(port, () => {
	console.log(`Situationboard listening on port ${port}`);
	console.log(`Open it up at http://localhost:${port}`);
});
