const express = require("express");
const router = express.Router();
const { sendPushNotification } = require("../controllers/notificationsController");

/**
 * @openapi
 * /push:
 *   post:
 *     summary: Enviar uma notificação push
 *     tags:
 *       - Push
 *     description: Envia uma notificação via Expo Push Notification Service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expoPushToken
 *               - title
 *               - body
 *             properties:
 *               expoPushToken:
 *                 type: string
 *                 example: ExponentPushToken[sxS2j38qKjsd9283js]
 *               title:
 *                 type: string
 *                 example: "Lembrete de Tarefa"
 *               body:
 *                 type: string
 *                 example: "Você tem uma tarefa pendente para hoje."
 *               data:
 *                 type: object
 *                 description: Dados adicionais enviados junto à notificação
 *                 example:
 *                   taskId: "67223a97ab01cd936c98b123"
 *     responses:
 *       200:
 *         description: Notificação enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notificação enviada com sucesso."
 *       400:
 *         description: Erro de validação ou token inválido
 *       500:
 *         description: Erro interno ao enviar a notificação
 */
router.post("/", sendPushNotification);

module.exports = router;
