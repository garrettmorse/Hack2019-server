// require
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const appRouter = require("./routers/app");
const dbRouter = require("./routers/db");

// server
const app = express();
const server = http.createServer(app);
const PORT = 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.url} at time: ${Date.now()}`);
  next();
});

app.get("/", (req, res) => {
  res.send(`Listening on ${PORT}`);
});

app.use("/app", appRouter);
app.use("/db", dbRouter);

server.listen(PORT, () => {
  address = server.address().address;
  port = server.address().port;
  console.log(`Server listening on ${address}:${port}`);
});
