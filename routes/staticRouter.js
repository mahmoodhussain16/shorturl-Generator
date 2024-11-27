const express = require("express");
const { getAllUrls} = require("../controllers/url");

const router = express.Router();

router.get("/", async (req, res) => {
    const allUrls = await getAllUrls;
    return res.render("home", {
        urls: allUrls,
    });
    
})
router.get("/signup", (req, res) => {
    return res.render("signup");
})
router.get("/login", (req, res) => {
    return res.render("login");
})

module.exports = router;