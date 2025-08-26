const verifyApiToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.API_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized - Invalid API token" });
  }
  next();
};

module.exports = verifyApiToken;
