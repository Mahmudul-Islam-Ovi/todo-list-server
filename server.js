const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.o8aveff.mongodb.net/`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: String,
  link: String,
  checked: Boolean,
  position: Number,
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort("position");
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addTodo", async (req, res) => {
  const { title, link } = req.body;
  const position = await Todo.countDocuments();

  const newTodo = new Todo({
    title,
    link,
    checked: false,
    position,
  });

  try {
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateTodo/:id", async (req, res) => {
  const { id } = req.params;
  const { checked, position, title, link } = req.body;

  try {
    const updates = {};

    if (checked !== undefined) {
      updates.checked = checked;
    }

    if (position !== undefined) {
      updates.position = position;
    }

    if (title !== undefined) {
      updates.title = title;
    }

    if (link !== undefined) {
      updates.link = link;
    }

    await Todo.findByIdAndUpdate(id, updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteTodo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
