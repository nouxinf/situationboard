import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

let cachedOilData = null;
let lastFetchTime = 0;

async function fetchOil() {
	try {
		const response = await fetch(
			"https://api.oilpriceapi.com/v1/prices/latest?by_code=WTI_USD",
			{
				headers: {
					Authorization: `Token ${process.env.OIL_PRICE_APIKEY}`,
				},
			},
		);
		const data = await response.json();
		cachedOilData = data;
		lastFetchTime = Date.now();
		console.log("Oil price data updated");
	} catch (error) {
		console.error("Failed to fetch oil price:", error);
	}
}

// fetch immediately on startup
await fetchOil();

// 7 hrs
setInterval(fetchOil, 7 * 60 * 60 * 1000);

router.get("/", (req, res) => {
	if (cachedOilData) {
		res.json(cachedOilData);
	} else {
		res.status(503).json({ error: "Oil price data not yet available" });
	}
});

export default router;
