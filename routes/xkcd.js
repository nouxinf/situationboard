import express from "express";

const router = express.Router();

async function fetchLatestComic() {
	try {
		const response = await fetch(`https://xkcd.com/info.0.json`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch xkcd:", error);
	}
}

async function fetchComicById(id) {
	try {
		const response = await fetch(`https://xkcd.com/${id}/info.0.json`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch xkcd:", error);
	}
}

router.get("/api/xkcd/current", async (req, res) => {
	try {
		const data = await fetchLatestComic();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve xkcd " });
	}
});

router.get("/api/xkcd/:id", async (req, res) => {
	try {
		const data = await fetchComicById(req.params.id);
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve xkcd " });
	}
});

export default router;
