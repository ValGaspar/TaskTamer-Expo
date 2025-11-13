// routes/taskRoutes.js
const express = require("express");
const {
  getAllTasks,
  getTasksByUser,
  getTaskStatistics,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// Todas as tarefas (geral)
router.get("/", getAllTasks);

// Tarefas de um usuário específico
router.get("/user/:userId", getTasksByUser); // << aqui
router.get("/get_statistics", getTaskStatistics);

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
