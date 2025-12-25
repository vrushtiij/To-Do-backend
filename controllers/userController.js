
const jwt = require('jsonwebtoken')
const db = require('../db')

require('dotenv').config();
const secretkey = process.env.jwt_secret;

exports.login = async (req,res) => {
    user = req.body.username;
    passw = req.body.password;
    try{
        const result = await db.sql.query`SELECT user_id, passw FROM users WHERE username = ${user}`
        if (result.recordset.length === 0)
        {
            return res.json({'message': 'username invalid'})
        }
        else {
            if (passw == result.recordset[0].passw) {
                const token = jwt.sign({user_id: result.recordset[0].user_id}, secretkey, {
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
        const result = await db.sql.query`Select * from users where username = ${username}`
        if (result.recordset.length === 0)
        {
            await db.sql.query`insert into users(name,username, passw) values(${namee}, ${username}, ${password})`
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
    result = await db.sql.query`Select * from ToDo where user_id = ${user_id}`;
    return res.json(result.recordset)
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
                await db.sql.query`insert into ToDo(task,task_status,user_id) values(${task}, ${status}, ${user_id})`
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
            await db.sql.query`update ToDo set task= ${task}, task_status= ${status} where task_id = ${task_id} and user_id = ${user_id}`
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
            const result = await db.sql.query`Select * from ToDo where task_id= ${task_id} and user_id = ${user_id}`
            if (result.recordset.length === 0)
            {
                res.json({'message': 'No such task exists'})
            }
            else {
                await db.sql.query`delete from ToDo where task_id = ${task_id} and user_id = ${user_id}`
                return res.json({"message": "deleted"});
            }
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({'message': 'Database error'});
        }
    }
}