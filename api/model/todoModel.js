const mongoose  = require('mongoose');


const todoSchema = new mongoose.Schema({
    title: String,
    text: String,
    completed: {type: Boolean, default: false},
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
    }
}, {timestamps:true})

const todoModel = mongoose.model("todo", todoSchema);

module.exports = todoModel;