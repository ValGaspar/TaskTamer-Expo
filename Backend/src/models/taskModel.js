const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  done: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },

  // campos TaskDetailPopUp
  date: { type: Date }, 
  priority: {
    type: String,
    enum: ["Alta", "Média", "Baixa"],
    default: "Baixa",
  },

   notificationId: { type: String },
});

module.exports = mongoose.model("Task", taskSchema);
