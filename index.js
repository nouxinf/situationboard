import express from "express";
const app = express();
const port = process.env.PORT || 3055;

import oilPriceRoutes from "./routes/oilprice.js";
import weatherRoutes from "./routes/weather.js";
import xkcdRoutes from "./routes/xkcd.js";

app.use(express.static("public"));
app.use("/", oilPriceRoutes);
app.use("/", weatherRoutes);
app.use("/", xkcdRoutes);

app.listen(port, "127.0.0.1", () => {
	console.log(`Situationboard listening on port ${port}`);
	console.log(`Open it up at http://localhost:${port}`);
});
