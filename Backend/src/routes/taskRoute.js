const express = require("express");
const {
  getAllTasks,
  getTasksByUser,
  getTaskStatistics,
  createTask,
  updateTask,
  deleteTask,
  getTasksCount
} = require("../controllers/taskController");

const router = express.Router();

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Retorna todas as tarefas cadastradas
 *     tags:
 *       - Tasks
 *     description: Retorna todas as tarefas existentes no sistema — uso principalmente administrativo.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/", getAllTasks);

/**
 * @openapi
 * /tasks/user/{userId}:
 *   get:
 *     summary: Retorna as tarefas de um usuário específico
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "671f12a9c38fa9d4f81e230b"
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/user/:userId", getTasksByUser);

/**
 * @openapi
 * /tasks/get_statistics:
 *   get:
 *     summary: Retorna estatísticas das tarefas
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     description: Retorna estatísticas gerais como total de concluídas, pendentes, produtividade semanal ou diária.
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 */
router.get("/get_statistics", getTaskStatistics);

/**
 * @openapi
 * /tasks/count:
 *   get:
 *     summary: Conta quantas tarefas existem no banco
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso
 */
router.get("/count", getTasksCount);

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Estudar React Native"
 *               description:
 *                 type: string
 *                 example: "30 minutos de estudo focado"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-21"
 *               priority:
 *                 type: string
 *                 enum: ["Prioridade Alta", "Prioridade Média", "Prioridade Baixa"]
 *                 example: "Prioridade Alta"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
router.post("/", createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser atualizada
 *         schema:
 *           type: string
 *           example: "67224b56bc10e2f1d4dbce12"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               done:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 */
router.put("/:id", updateTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa a ser excluída
 *         schema:
 *           type: string
 *           example: "67224b56bc10e2f1d4dbce12"
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete("/:id", deleteTask);

module.exports = router;
