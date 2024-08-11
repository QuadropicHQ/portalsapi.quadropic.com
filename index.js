const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  res.render("serverok", {
    ipadress: ip,
  });
});

app.listen(8080);
