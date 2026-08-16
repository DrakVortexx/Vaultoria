const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { securityMiddleware } = require("./middleware/security");

const app = express();
const PORT = process.env.PORT || 3000;

securityMiddleware(app);

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/player", require("./routes/player"));
app.use("/api/shop", require("./routes/shop"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/trade", require("./routes/trade"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Vaultoria server running on port ${PORT}`);
});
