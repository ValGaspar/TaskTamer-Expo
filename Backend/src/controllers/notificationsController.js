const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Envia notificação para um dispositivo Expo
const sendPushNotification = async (req, res) => {
  const { expoPushToken, title, body } = req.body;

  if (!expoPushToken) {
    return res.status(400).json({ message: "Token do dispositivo é obrigatório." });
  }

  // Expo Push API espera um array de mensagens, mesmo que seja uma só
  const messages = [{
    to: expoPushToken,
    sound: "default",
    title,
    body,
  }];

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Erro completo ao enviar notificação:", error);
    res.status(500).json({ 
      message: "Erro ao enviar notificação", 
      error: error.toString() 
    });
  }
};

module.exports = { sendPushNotification };
