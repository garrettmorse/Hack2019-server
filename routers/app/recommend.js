// later
const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", async (req, res) => {
  let response = {
    success: false,
    msg: ""
  };
  const temp = req.body.temperature;
  const style = req.body.style;
  const user = req.body.username;
  let climate = "";
  if (temp < 50) {
    climate = "cold";
  } else if (temp > 70) {
    climate = "hot";
  } else {
    climate = "mild";
  }
  if (style && user) {
    response.success = true;
    response.msg = "Parameters Valid";
    response.data = await db.getValidList(req.body.username, climate, style);
    res.status(202).send(JSON.stringify(response));
  } else {
    response.msg = "Parameters Invalid";
    res.status(400).send(JSON.stringify(response));
  }
});

module.exports = router;
