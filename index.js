const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PostRouter = require("./routes/post");

app.get("/api/ping", async (request, response, next) => {
  response.status(200).json({ success: true });
});

app.use("/api/posts", PostRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});

module.exports = app;
