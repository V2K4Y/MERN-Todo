const zod = require('zod');

const createTodo = zod.object({
    title: zod.string(),
    text: zod.string(),
})

const updateTodo = zod.object({
    id: zod.string(),
})

const deleteTodo = zod.object({
    id: zod.string(),
})

module.exports = { createTodo, updateTodo, deleteTodo}