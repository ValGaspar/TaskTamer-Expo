const Task = require("../models/taskModel");
const mongoose = require("mongoose");

const getAllTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    let tasks;
    tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas", error });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const [year, month, day] = date.split("-")
    const tasks = await Task.find({ userId: userId, date: {
        $gte: new Date(year, month-1, day, 0,0,0), 
        $lt: new Date(year, month-1, day, 23,59,59)
    } }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do usuário", error });
  }
};

const getTaskStatistics = async (req, res) => {
  const { userId } = req.user;
  const monday = getMonday(new Date());
  const [monday_year, monday_month, monday_day] = monday.toISOString().split("T")[0].split("-");
  const [sunday_year, sunday_month, sunday_day] = (new Date(monday_year, Number(monday_month)-1, Number(monday_day)+6)).toISOString().split("T")[0].split("-");

  try {
    const tasks = await Task.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), done: true, date: {
          $gte: new Date(monday_year, monday_month-1, monday_day, 0,0,0), 
          $lt: new Date(sunday_year, sunday_month-1, sunday_day, 23,59,59)
        } }
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 } // this means that the count will increment by 1
        }
      }
      ]);

      const pendingTasks = await Task.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), done: false, date: {
          $gte: new Date(monday_year, monday_month-1, monday_day, 0,0,0), 
          $lt: new Date(sunday_year, sunday_month-1, sunday_day, 23,59,59)
        } }
      },
      {
        $group: {
          _id: '$done',
          count: { $sum: 1 } // this means that the count will increment by 1
        }
      }
      ]);

      const pending = pendingTasks.length == 0 ? 0 : pendingTasks[0].count;
      res.json({graph: tasks, pending: pending });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do usuário", error });
  }
};

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

const createTask = async (req, res) => {
  try {
    const { title, description, date, priority, notificationId } = req.body;
    const newTask = new Task({
      userId: req.user.userId,
      title,
      description,
      date: date ? new Date(date) : undefined,
      priority: priority || "Prioridade Média",
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
  getTaskStatistics,
  createTask,
  updateTask,
  deleteTask,
};
