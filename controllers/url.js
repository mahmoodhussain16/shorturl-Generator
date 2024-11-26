const shortid = require('shortid');
const URL = require('../models/url');

async function getAllUrls() {
    try {
        return await URL.find({});
    } catch (err) {
        console.error('Error fetching URLs:', err);
        throw new Error('Error fetching URLs');
    }
}

async function handleGenerateNewShortUrl(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: 'url is required' });

        const shortID = shortid();
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });
        const allUrls = await getAllUrls();
        return res.render("home", {
            urls: allUrls,
            newShortId: shortID,
        });

    } catch (err) {
        console.error('Error generating short URL:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function visitHistory(req, res) {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.redirect(entry.redirectURL);
    } catch (err) {
        console.error('Error updating visit history:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}
module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
    visitHistory,
    getAllUrls,
}