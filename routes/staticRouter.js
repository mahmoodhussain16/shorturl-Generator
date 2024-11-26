const express = require("express");
const {handleGenerateNewShortUrl} = require("../controllers/url");

const router = express.Router();

router.get("/", handleGenerateNewShortUrl)

module.exports = router;