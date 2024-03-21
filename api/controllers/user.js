const userModel = require('../model/user');
const { generateToken } = require('../services/token');
const { deleteTodo } = require('../types');


const getAllUser = (req, res) => {
    userModel.find({}).then(users => {return res.status(200).json({msg: 'Users List', users})})
    .catch(err => {return res.status(400).json({msg: "Error !!!!", err})});
}

const regUser = async (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(404).json({msg: "Request body not found !"});
    }
    const {username, password} = req.body;
    const find = await userModel.findOne({username});
    if(find) 
        return res.status(200).json({msg: "User already exist!"});
    const user = await userModel.create({username, password});
    const token = generateToken(user._id);
    res.cookie('usid', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
    })
    res.status(200).json({msg: "User registered !", username: user.username, id: user._id});
}

const loginUser = async (req, res) => {
    if(!req.body.username || !req.body.password) 
        return res.status(404).json({msg: "Request body not found !"});
    const {username, password} = req.body;
    const user = await userModel.findOne({username});
    if(user && await user.matchPassword(password)) {
        const token = generateToken(user._id);
        res.cookie('usid', token, {
            maxAge: 60 * 60 * 1000,
        });
        return res.status(200).json({msg: "Logged In", username: user.username, id: user._id});
    }
    res.status(200).json({msg: "Invalid Username or Password!"});
}

const deleteuser = (req, res) => {
    const payload = req.body;
    const parse = deleteTodo.safeParse(payload);
    if(!parse.success) return res.status(401).json({msg: "Invalid input !"})
    userModel.findByIdAndDelete(payload.id)
    .then(user => {
        if(!user) return res.status(404).json({msg: "User not found !"})
        return res.status(201).json({msg: 'User Deleted !', user});
    }).catch(err => {return res.status(400).json({msg: "Error!!!!", err})})
}

const userLogout = (req, res) => {
    res.cookie('usid', '', { expires: new Date(0) });
    return res.status(200).json({msg: 'Looged Out !'})
}

module.exports = { regUser, loginUser, deleteuser, getAllUser, userLogout };