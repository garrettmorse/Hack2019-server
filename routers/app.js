const express = require("express");
const router = express.Router();

const uploadRoute = require("./app/upload");
const recommendRoute = require("./app/recommend");

// ./app

router.use((req, res, next) => {
  if (req.url === "/upload" || req.url === "/recommend") {
    next();
  } else {
    const response = {
      success: false,
      msg: "Bad Route"
    };
    res.status(401).send(JSON.stringify(response));
  }
});

router.get("/", (req, res) => {
  res.send("Welcome, my boi");
});

router.use("/upload", uploadRoute);
router.use("/recommend", recommendRoute);

module.exports = router;
