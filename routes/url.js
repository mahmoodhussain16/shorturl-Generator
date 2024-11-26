const express = require("express");
const {handleGenerateNewShortUrl,handleGetAnalytics,visitHistory}=require("../controllers/url");


const router=express.Router();


router.post("/",handleGenerateNewShortUrl);
router.get('/analytics/:shortId',handleGetAnalytics)
router.get('/:shortId',visitHistory)

module.exports = router;


