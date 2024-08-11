const dotenv = require("dotenv");
const express = require("express");
const app = express();

//FIXME: For Dev environment is setup but PROD env sould be configured
dotenv.config({ path: ".env.test.local" });

app.use(express.json());
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

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

app.listen(8080);
