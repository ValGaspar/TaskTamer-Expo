const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createUser, updateUser, deleteUser, getAllUsers, savePushToken } = require('../controllers/userController');

const router = express.Router();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Users
 *     description: Endpoint público para cadastro de usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado
 */
router.post('/', createUser);

/**
 * @openapi
 * /users/save-token:
 *   post:
 *     summary: Salva o token de push notification do usuário
 *     tags:
 *       - Users
 *     description: Salva ou atualiza o Expo Push Token do usuário para envio de notificações.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - expoPushToken
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "672147834ab90123ffba94e2"
 *               expoPushToken:
 *                 type: string
 *                 example: "ExponentPushToken[abcde12345token]"
 *     responses:
 *       200:
 *         description: Token salvo com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/save-token", savePushToken);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Apenas usuários autenticados podem atualizar seus dados.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "672147834ab90123ffba94e2"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', authMiddleware, updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Apenas usuários autenticados podem deletar suas contas.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser removido
 *         schema:
 *           type: string
 *           example: "672147834ab90123ffba94e2"
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
