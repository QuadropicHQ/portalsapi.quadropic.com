exports.getSessionId = function (uid) {
  const epochs = Date.now();
  return uid + epochs;
};
