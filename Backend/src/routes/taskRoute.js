const express = require("express");
const router = express.Router();

const taskModel = require("../models/taskModel");

router.get("/", async(req, res)=>{
    const tasks = await Task.find();
    res.json(tasks);
});

router.post("/", async(req, res)=>{
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
});

router.put("/", async(req,res)=>{
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

router.delete("/", async(req, res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarefa deletada' });
});

module.exports = router;
