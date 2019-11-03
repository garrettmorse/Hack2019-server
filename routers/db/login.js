const express = require("express");
const db = require("../../database/db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  await db
    .login(username, password)
    .then(response => {
      response.message = "Login success!";
      res.status(202).send(JSON.stringify(response));
    })
    .catch(err => res.status(500).send(JSON.stringify(err)));
  console.log("login complete");
});

module.exports = router;
