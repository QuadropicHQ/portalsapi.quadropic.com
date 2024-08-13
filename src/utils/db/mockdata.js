//TODO: Make a new file named as root.js (OR) root.ts to implement same features in PostgresSQL using Prisma

// Mock Users

const users = [
  {
    id: "alexf1",
    name: "Alex Fendrich",
    email: "alexf1@quadropic.com",
    password: "mypass",
  },
  {
    id: "lilflo",
    name: "Little Flower",
    email: "lilflow@quadropic.com",
    password: "mypass",
  },
];

//TODO: IMPORTANT: For SQL dev, let the session be a separate table and add a relation to users table

// Session Data decoded but originally in form of List of IDs which are UNIQUE
const sessions = [
  {
    id: "session1",
    userId: "alexf1",
  },
  {
    id: "session2",
    userId: "lilflo",
  },
  {
    id: "session3",
    userId: "alexf1",
  },
];

//Blocked Users
const blockedUsers = [];

//Add a new session to user
function createSession(userId, sessionId) {
  const session = sessions.find((u) => s.id === sessionId);
  if (session) {
    sessions.push({ id: sessionId, userId: userId });
  }
}

// Remove a session from user
function removeSessionFromUser(userId) {
  const sessionId = `session${sessions.length + 1}`;
  const session = sessions.find((u) => s.id === sessionId);
  if (session && session.userId === userId) {
    sessions = sessions.filter((s) => s.id !== sessionId);
  }
  return sessionId;
}

// Check User for Login
function checkUser(id, password) {
  const user = users.find((u) => u.id === id);
  if (user && user.password === password) {
    user = { id: user.id, name: user.name, email: user.email };
    return user;
  } else {
    return null;
  }
}

// Add User
function addUser(username, password, email) {
  users.push({
    id: username,
    name: username,
    email: email,
    password: password,
  });
  createSession(username, `session${sessions.length + 1}`);
}

// Block User by removing all sessions
function blockUser(username) {
  sessions = sessions.filter((s) => s.userId !== username);
  blockedUsers.push(username);
}

export { checkUser, addUser, blockUser };
