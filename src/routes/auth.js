//DEMO Auth JS with JWT

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  //TODO: Checking if credentials match
  if (true) {
    const accessToken = jwt.sign(
      {
        username: username,
        email: "hello@quadropic.com",
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      {
        username: username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1y" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt_access", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("jwt_refersh", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
