const express = require('express');
const taskRoutes = require('./taskRoute');
const userRoutes = require('./userRoute');
const authRoutes = require('./authRoute');
const pushRoutes = require("./pushRoute");

const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Testa se a API está funcionando
 *     tags:
 *       - Root
 *     responses:
 *       200:
 *         description: Retorno simples indicando que a API está ativa
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: API TaskTamer no ar!
 */
router.get('/', (req, res) => res.send('API TaskTamer no ar!'));

/**
 * @openapi
 * /auth:
 *   post:
 *     summary: Endpoint público para login do usuário
 *     tags:
 *       - Auth
 *     description: Redireciona para as rotas de autenticação (authRoute)
 */
router.use('/auth', authRoutes);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Endpoint público para criação de usuário
 *     tags:
 *       - Users
 *     description: Redireciona para rotas de usuário (userRoute)
 */
router.use('/users', userRoutes);

/**
 * @openapi
 * /push:
 *   post:
 *     summary: Envia notificações push
 *     tags:
 *       - Push
 *     description: Rotas relacionadas a notificações
 */
router.use('/push', pushRoutes);

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Endpoints protegidos para gerenciar tarefas
 *     tags:
 *       - Tasks
 *     description: Todas as rotas de tarefas exigem autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: Não autorizado — token ausente ou inválido
 */
router.use('/tasks', authMiddleware, taskRoutes);

module.exports = router;
