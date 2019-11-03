const express = require("express");
const router = express.Router();

const uploadRouter = require("./app/upload");
const recommendRouter = require("./app/recommend");

// ./app

router.use((req, res, next) => {
  if (req.url === "/upload" || req.url === "/recommend") {
    next();
  } else {
    let response = {
      success: false,
      msg: "Bad Route"
    };
    res.status(401).send(JSON.stringify(response));
  }
});

router.get("/", (req, res) => {
  res.send("Welcome, my boi");
});

router.use("/upload", uploadRouter);
router.use("/recommend", recommendRouter);

module.exports = router;
