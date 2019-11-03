// later
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", (req, res) => {
  let response = {
    success: false,
    msg: ""
  };
  const temp = req.body.temperature;
  const type = req.body.type;
  let climate = "";
  if (temp < 50) {
    climate = "cold";
  } else if (temp > 70) {
    climate = "hot";
  } else {
    climate = "mild";
  }
  if (climate) {
    response.success = true;
    response.message = "Parameters Valid";
    db.getValidList(climate, type);
    res.status(202).send(JSON.stringify(response));
  } else {
    response.message = "Parameters Invalid";
    res.status(400).send(JSON.stringify(response));
  }
});

module.exports = router;
