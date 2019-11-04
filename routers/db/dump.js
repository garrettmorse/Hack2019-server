const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.get("/", (req, res) => {
  response.data = db
    .dump()
    .then(response => {
      res.status(200).send(JSON.stringify(response));
    })
    .catch(err => res.status(500).send(JSON.stringify(err)));
});

module.exports = router;
