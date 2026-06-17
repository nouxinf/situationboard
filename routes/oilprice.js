import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

let cachedOilData = null;
let lastFetchTime = 0;

async function fetchOil() {
	try {
		const response = await fetch(
			`https://api.eia.gov/v2/seriesid/PET.RWTC.D?api_key=${process.env.OILPRICE_API_KEY}`,
		);
		const data = await response.json();
		cachedOilData = data;
		lastFetchTime = Date.now();
		console.log("Oil price data updated");
		return data;
	} catch (error) {
		console.error("Failed to fetch oil price:", error);
	}
}

router.get("/api/oilprice", async (req, res) => {
	try {
		const data = await fetchOil();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve oil price " });
	}
});

export default router;
