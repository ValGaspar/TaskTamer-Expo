const express = require("express");
const router = express.Router();
const { sendPushNotification } = require("../controllers/notificationsController");

router.post("/", sendPushNotification);

module.exports = router;
