require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./mock_database/database");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Using Multer To Parse Form Data
app.post("/api/shorturl", upload.none(), (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.json({ error: "invalid url" });
  }
  // Regex to validate URL
  const regex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  if (regex.test(url)) {
    const data = db.createNew(url);
    res.json({ original_url: data.original_url, short_url: data.id });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const url = db.findURL(Number(id));
  if (url) {
    res.redirect(url.original_url);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use(function (req, res, next) {
  res.status(404).type("text").send("Route Not Found");
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
