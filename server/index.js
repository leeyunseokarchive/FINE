const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuid } = require("uuid");

const PORT = process.env.PORT || 4000;
const EVENTS_PATH = path.join(__dirname, "data", "calendar.json");
const COMMUNITY_PATH = path.join(__dirname, "data", "community.json");

const readJsonArray = async (filePath) => {
  try {
    const data = await fs.readJson(filePath);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    return [];
  }
};

const writeJsonArray = async (filePath, payload) => {
  try {
    await fs.writeJson(filePath, payload, { spaces: 2 });
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
  }
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

const formatCommunitySummary = (post) => ({
  id: post.id,
  category: post.category,
  title: post.title,
  replies: Array.isArray(post.comments) ? post.comments.length : 0,
  author: post.author,
  createdAt: post.createdAt,
});

app.get("/events", async (_req, res) => {
  const events = await readJsonArray(EVENTS_PATH);
  res.json(events);
});

app.post("/events", async (req, res) => {
  const { date, title } = req.body;

  if (!date || !title) {
    return res.status(400).json({ message: "date and title are required" });
  }

  const events = await readJsonArray(EVENTS_PATH);
  const newEvent = {
    id: uuid(),
    date,
    title,
  };

  events.push(newEvent);
  await writeJsonArray(EVENTS_PATH, events);

  res.status(201).json(newEvent);
});

app.get("/community", async (_req, res) => {
  const posts = await readJsonArray(COMMUNITY_PATH);
  res.json(posts.map(formatCommunitySummary));
});

app.get("/community/:id", async (req, res) => {
  const posts = await readJsonArray(COMMUNITY_PATH);
  const post = posts.find((item) => item.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Calendar server listening on http://localhost:${PORT}`);
});

