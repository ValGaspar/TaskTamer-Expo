const fetch = require("node-fetch");

// Envia notificação para um dispositivo Expo
const sendPushNotification = async (req, res) => {
  const { expoPushToken, title, body } = req.body;

  if (!expoPushToken) {
    return res.status(400).json({ message: "Token do dispositivo é obrigatório." });
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar notificação", error });
  }
};

module.exports = { sendPushNotification };
