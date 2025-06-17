const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.post("/proxy", async (req, res) => {
  const { url, method = "GET", headers = {}, payload = null } = req.body;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : null,
    });

    const contentType = response.headers.get("content-type");
    const data = await response.text();

    // Nếu là JSON thì gửi JSON, còn lại gửi raw text
    if (contentType && contentType.includes("application/json")) {
      res.status(response.status).json(JSON.parse(data));
    } else {
      res.status(500).send(`❌ Proxy nhận HTML thay vì JSON từ GHN:\n\n${data}`);
    }
  } catch (error) {
    res.status(500).send("❌ Proxy error: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
