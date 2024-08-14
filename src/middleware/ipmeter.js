// Middleware to add IP Address to the request object
module.exports = function (req, res, next) {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  req.ipaddress = ip;
  next();
};
