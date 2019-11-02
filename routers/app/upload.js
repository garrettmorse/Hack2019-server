const express = require("express");
const fs = require("fs");
const db = require("../../database/db");
const path = require("path");

const router = express.Router();
const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Sorry, something went wrong!");
};

router.get("/", express.static(path.join(__dirname, "../../uploads/")));

router.post("/", (req, res) => {
  let response = {
    success: false,
    msg: ""
  };
  const imgPath = req.body.type.toLowerCase();
  if (imgPath === ".jpg" || imgPath === ".png") {
    db.uploadImage(req.body.uri, imgPath);
    response.success = true;
    response.msg = "Image Upload Successful";
    res.status(202).send(JSON.stringify(response));
  } else {
    response.msg = "Bad Image";
    res.status(400).send(JSON.stringify(response));
  }
});

module.exports = router;
