const express = require('express');
const todoModel = require('../model/todoModel');
const { getAllTodo, addTodo, markItComplete, removeTodo } = require('../controllers/todos');
const router = express.Router();

router.route('/')
.get(getAllTodo)
.post(addTodo)
.put(markItComplete)
.delete(removeTodo);

module.exports = router;