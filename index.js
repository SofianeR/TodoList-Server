const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/TodoList");

const Task = mongoose.model("Task", {
  title: String,
  status: Boolean,
});

const app = express();
app.use(formidable());

app.get("/list", async (req, res) => {
  try {
    const list = await Task.find();
    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/addTask", async (req, res) => {
  try {
    const { title, status } = req.fields;
    if ((title && status === false) || status === true) {
      const newTask = new Task({
        title: title.toLowerCase(),
        status: status,
      });
      await newTask.save();
      res.json("Task Ajoutée");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/updateTask", async (req, res) => {
  try {
    const task = await Task.findOne({ title: req.fields.title.toLowerCase() });
    if (task) {
      task.status = req.fields.status;
      task.save();
      res.json(task);
    } else {
      res.json("Aucune task correspondante");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.post("/deleteTask", async (req, res) => {
  try {
    if (req.fields.title) {
      const filter = { title: req.fields.title.toLowerCase() };
      console.log(filter);
      const taskToDelete = await Task.findOneAndDelete(filter);
      res.json(taskToDelete);
    } else {
      res.status(400).json({ message: "informations manquante" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("*", (req, res) => {
  res.status(400).json({ message: "Page Introuvable" });
});

app.listen(3000, () => {
  console.log("Server launched !");
});
