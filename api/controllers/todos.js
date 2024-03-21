const todoModel = require('../model/todoModel');
const { createTodo, updateTodo, deleteTodo } = require('../types');

const getAllTodo = async (req, res) => {    
    res.json({
        msg: "Hello from the server!",
        todos: await todoModel.find({uid: req.id})
    });

}

const addTodo = async (req, res) => {
    const inputPayload = req.body;
    const parse = createTodo.safeParse(inputPayload);
    if(!parse.success) return res.status(411).json({
        msg: 'Wrong input provided !',
    })
    try {
        const user = await todoModel.create({title: inputPayload.title, text: inputPayload.text, uid: req.id})
        return res.json({
            msg: 'Item added to todo',
            id: user._id,
        })
    } catch (error) {
        return res.json({msg: 'Error from server side !', err: error});
    }

}

const markItComplete = (req, res) => {
    const payload = req.body;
    const parse = updateTodo.safeParse(payload);
    if(!parse.success) return res.status(411).json({
        msg: 'Wrong input provided !',
    })
        todoModel.findOneAndUpdate({_id: req.body.id}, 
            {completed: true})
            .then(user => {
                res.status(200).json({
                    msg: "Task marked as completed!",
                    id: user,
                })
            })
            .catch (error => {
                res.json({msg: "Error from server side !", err: error});
            });
}

const removeTodo = (req, res) => {
    const payload = req.body;
    const parse = deleteTodo.safeParse(payload);
    if(!parse.success) return res.json({msg: "Invalid input"});
    todoModel.findOneAndDelete({_id:payload.id})
    .then(data => {
        if(!user) return res.status(404).json({msg: "User not found !"})
        return res.json({msg: "Deleted!", data})
    }).catch(err => res.json({msg: "Error", Error: err}))
}

module.exports = { getAllTodo, addTodo, markItComplete, removeTodo };