const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    task: String,
    status: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("todo", todoSchema, "ToDo")