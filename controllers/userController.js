
const jwt = require('jsonwebtoken')
const User = require("../models/user.model");
const todo = require("../models/todo.model");
const { default: mongoose } = require('mongoose');

require('dotenv').config();
const secretkey = process.env.jwt_secret;

exports.login = async (req,res) => {
    user = req.body.username;
    passw = req.body.password;
    try{
        const result = await User.findOne({ user })
        if (!result)
        {
            return res.json({'message': 'username invalid'})
        }
        else {
            if (passw == result.pass) {
                const token = jwt.sign({user_id: result._id.toString()}, secretkey, {
                    expiresIn: '1h'
                });
                res.cookie("auth", token, {
                    httpOnly: true,
                    maxAge: 3600000,
                    sameSite: 'lax',
                    secure: false
                })
                return res.json({ success: true, message: "login successful" });
            }
            else {
                return res.json({success: false, message: 'invalid password'})
            }
        }
    }
    catch(err) {
        console.log(err);
        res.json({success: false, 'message': 'Error occurred'})
    }
}

exports.register = async (req,res) => {
    namee = req.body.name;
    username = req.body.user;
    password = req.body.pass;
    try {
        const result = await User.findOne({user: username})
        if (!result)
        {
            await User.create({
                name: namee,
                user: username,
                pass: password
            })
            return res.status(201).json({'success': true , 'message': 'user created'})
        }
        else
        {
            return res.json({success: false,'message': 'username already exists'})
        }
    }
    catch(err) {
        console.log(err);
        return res.json({success: false,'message' : err});
    }
}

exports.checkAuth = async (req,res) => {
    return res.json({success: true, user_id: req.user_id})
}

exports.getTask = async (req,res) => {
    user_id = req.user_id;
    try {
    result = await todo.find({user_id: new mongoose.Types.ObjectId(user_id)});
    return res.json(result)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Database error" });
    }
}

exports.createTask = async (req,res) => {
    user_id = req.user_id;
    const task = req.body.task;
    const status = req.body.status; 
    if (task == null || status == null) {
        return res.json({'message':'details not specified'})
    }
    else {
        try {
                await todo.create({
                    task: task,
                    status: status,
                    user_id: new mongoose.Types.ObjectId(user_id)
                })
                return res.status(201).json({'message': 'task added'});
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({'message':'Database error'});
        }
    }
}

exports.updateTask = async (req,res) => {
    const user_id = req.user_id;
    const task_id = req.params.id;
    const task = req.body.task;
    const status = req.body.status;

    if (task == null || status == null || task_id == null) {
        return res.json({'message':'details not specified'})
    }
    else {
        try {
            await todo.updateOne(   
                {   _id: new mongoose.Types.ObjectId(task_id),
                    user_id: new mongoose.Types.ObjectId(user_id)
                },
                {$set: {task: task, status: status}}
            )
            return res.json({"message": "updated"});
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({'message':'Database error'});
        }
    } 
}

exports.deleteTask = async (req,res) => {
    const user_id = req.user_id;
    const task_id = req.params.id;
    if (task_id == null || user_id == null)
    {
        return res.json({'message': 'Id not provided'})
    }
    else {
        try {
            await todo.deleteOne({_id: new mongoose.Types.ObjectId(task_id), user_id: new mongoose.Types.ObjectId(user_id)})
            return res.json({"message": "deleted"});
            
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({'message': 'Database error'});
        }
    }
}