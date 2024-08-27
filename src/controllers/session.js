const { signJWT } = require("../utils/gen/jwt/root");

const {
  createSession,
  removeSessionFromUser,
  checkUser,
  getUserById,
} = require("../utils/db/root"); //FIXME: When Code completed replace MockData with Root
const { autoRToken, autoAToken } = require("./token");
const { getSessionId } = require("../utils/gen/session/createSid");

function createSessionController(req, res) {
  // Get ID and Password from request BODY
  const { id, password } = req.body;

  // Check for user in Database
  const user = checkUser(id, password);
  if (user == null) {
    return res.status(401).send("Invalid credentials");
  }

  // Create a session
  const session = createSession(user.id, "samplesession");

  //CREATE ACCESS TOKEN
  const accessToken = signJWT({ id: user.id, sessionId: session }, "5m");

  // SET ACCESS TOKEN COOKIE
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000, // 5 Minutes
    //TODO: secure: true, ENFORCE HTTPS
  });

  // CREATE REFRESH TOKEN
  const refreshToken = signJWT(
    { sessionId: session, ip: req.ipaddress, userId: user.id },
    true
  );

  // SET REFRESH TOKEN COOKIE
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 183 * 24 * 60 * 60 * 1000, //183 Days
    //TODO: secure: true, ENFORCE HTTPS
  });

  return res.send("Session Created");
}

function removeSessionController(req, res) {
  removeSessionFromUser(req.user, req.sessionId);
  res.send("Session removed");
}

function removeThisSession(req, res) {
  removeSessionFromUser(req.user, req.sessionId);
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.send("Session removed");
}

function checkSessionController(req, res) {
  return res.send(req.user);
}

async function CreateSessionNoPropsController(req, res) {
  try {
    const id = req.user;
    const verified = req.verified;
    // Check for user in Database
    const user = await getUserById(id);
    if (!user || !verified) {
      return res.status(401).send("Invalid credentials");
    }

    // Create a session
    const sessionId = getSessionId(user.username);
    await createSession(user.username, sessionId);

    // SET ACCESS TOKEN and REFRESH TOKEN
    autoAToken(user.username, sessionId, req, res);
    autoRToken(user.username, sessionId, req, res);
    return res.status(200).send("Session Created");
  } catch (error) {
    console.error("Error in createSessionNoPropsController:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createSessionController,
  removeSessionController,
  removeThisSession,
  checkSessionController,
  CreateSessionNoPropsController,
};
