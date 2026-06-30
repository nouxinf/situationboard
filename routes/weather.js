import express from "express";
import { fetchWeatherApi } from "openmeteo";

const router = express.Router();
const url = "https://api.open-meteo.com/v1/forecast";
let lat;
let lon;
let getLat = () => {
	return lat;
};
let getLon = () => {
	return lon;
};

router.get("/api/weather", async (req, res) => {
	lat = parseFloat(req.query.lat);
	lon = parseFloat(req.query.lon);
	const tempParams = {
		latitude: lat,
		longitude: lon,
		current:
			"temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
		hourly: "temperature_2m,precipitation",
		daily: "weather_code,temperature_2m_max,temperature_2m_min",
	};
	if (!req.query.lat || !req.query.lon) {
		return res.status(400).json({ error: "lat and lon are required" });
	}
	const responses = await fetchWeatherApi(url, tempParams);
	const response = responses[0];

	const daily = response.daily();
	const utcOffsetSeconds = response.utcOffsetSeconds();

	const range = (start, stop, step) =>
		Array.from(
			{ length: (stop - start) / step },
			(_, i) => start + i * step,
		);

	const times = range(
		Number(daily.time()),
		Number(daily.timeEnd()),
		daily.interval(),
	);

	const forecast = times.map((t, i) => ({
		date: new Date((t + utcOffsetSeconds) * 1000)
			.toISOString()
			.split("T")[0],
		weatherCode: daily.variables(0).valuesArray()[i],
		maxTemp: daily.variables(1).valuesArray()[i],
		minTemp: daily.variables(2).valuesArray()[i],
	}));
	// start nominatim fetch
	const nominatim = await fetch(
		`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en&zoom=14`,
		{
			headers: {
				"User-Agent": "SituationBoard/Beta (nouxinf on github)",
			},
		},
	);
	const nominatimData = await nominatim.json();
	// console.log(nominatimData.address.city);

	const area =
		nominatimData.address.suburb ||
		nominatimData.address.neighbourhood ||
		nominatimData.address.quarter;
	const city =
		nominatimData.address.city ||
		nominatimData.address.town ||
		nominatimData.address.village;
	const place =
		area && city
			? `${area}, ${city}`
			: city || area || nominatimData.address.country;
	res.json([forecast, nominatimData.address.city]);
});

export default router;
