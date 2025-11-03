const Task = require("../models/taskModel");

const getAllTasks = async (req, res) => {
  try {
    const { user } = req.query;
    let tasks;
    if (user) {
      tasks = await Task.find({ user });
    } else {
      tasks = await Task.find();
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas", error });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do usuário", error });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, date, priority, user, notificationId } = req.body;

    const newTask = new Task({
      title,
      description,
      date: date ? new Date(date) : undefined,
      priority: priority || "Prioridade Média",
      user,
      notificationId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar tarefa", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, done, date, priority, notificationId } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        done,
        date: date ? new Date(date) : undefined,
        priority,
        notificationId,
      },
      { new: true }
    );

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
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
};
