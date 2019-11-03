const express = require("express");
const fs = require("fs");
const db = require("../../database/db");
const path = require("path");

const router = express.Router();

router.post("/", (req, res) => {
  let response = {
    success: false,
    msg: ""
  };
  const imgType = req.body.type.toLowerCase();
  if (imgType === ".jpg" || imgType === ".png" || imgType === ".jpeg") {
    db.uploadImage(req.body.uri, imgType);
    response.success = true;
    response.msg = "Image Upload Successful";
    res.status(202).send(JSON.stringify(response));
  } else {
    response.msg = "Bad Image";
    res.status(400).send(JSON.stringify(response));
  }
});

module.exports = router;
