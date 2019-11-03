const express = require("express");
const router = express.Router();

const enrollRouter = require("./db/enroll");
const loginRouter = require("./db/login");

// ./db

router.use((req, res, next) => {
  if (req.url === "/enroll" || req.url === "/recommend") {
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
  res.send("If you see this, call the police.");
});

router.use("/enroll", enrollRouter);
router.use("/login", loginRouter);

module.exports = router;
