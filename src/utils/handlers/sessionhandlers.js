import { createSession, removeSessionFromUser } from "../sessions";

export function createSessionHandler(req, res) {
  const { id, password } = req.body;
  const user = checkUser(username, password);
  if (user) {
    // Authnenticated as user
    const session = createSession(user.id);
    res.status(200).json({ message: "Session Created" });
    //TODO: ADD A SESSION COOKIE
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
}
