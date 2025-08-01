const Task = require("../models/taskModel");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas", error });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar tarefa", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar tarefa", error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao deletar tarefa", error });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
