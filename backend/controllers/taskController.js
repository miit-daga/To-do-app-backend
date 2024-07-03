const { decode } = require("punycode");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { count } = require("console");

// @route  GET /tasks
// @desc   Get tasks of the user
// @access Private
const getTasks = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tasks = await Task.find({ user: decodedToken.user_id });
        res.json({
            tasks: tasks
        });
    } catch (err) {
        res.status(500).json('TaskModel error');
        console.log(err);
    }
};

// @route  GET /tasks/:id
// @desc   Get a task of _id=id of the user
// @access Private
const getTask = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tasks = await Task.find({ user: decodedToken.user_id });
        const task = tasks.find((task) => task._id.toString() === req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve task from database" });
        console.log(err);

    }
};

// @route  GET /tasks/completed
// @desc   Get completed tasks of the user
// @access Private
const getCompletedTasks = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tasks = await Task.find({ user: decodedToken.user_id , completed: true });
        res.json({
            tasks: tasks
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve task from database" });
        console.log(err);
    }
};

// @route  GET /tasks/incompleted
// @desc   Get incompleted tasks of the user
// @access Private
const getIncompletedTasks = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tasks = await Task.find({ user: decodedToken.user_id, completed: false });
        res.json({tasks: tasks});
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve task from database" });
        console.log(err);
    }
};

// @route  POST /task
// @desc   Add user task
// @access Private
const addTask = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!req.body.title) {
            res.status(400);
            throw new Error("Please add a task!");
        }
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            user: decodedToken.user_id,
            completed: false,
        });
        res.json({
            task:task
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add task to database" });
        console.log(err);
    }
};

// @route  PUT /updatecontent/:id
// @desc   Change user task content
// @access Private
const updateTaskContent = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.user_id;
        const {title, description,dueDate} = req.body;
        // makes sure the logged in user matches the user of the task
        if (task.user.toString() !== userId) {
            res.status(401);
            throw new Error("User not authorized!");
        }
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(400);
            throw new Error("Task not found!");
        }
        if(title) task.title = title;
        if(task.description) task.description = description;
        if(task.dueDate) task.dueDate = dueDate;
        task.taskStatus= false;
        await task.save();
        res.status(200).json({
            success: true,
            message: "Task content changed successfully!",
            title: task.title,
            description: task.description,
            task:task
        });
    } catch(err) {
        res.status(500).json({ message: err });
        console.log(err);
    }
};

// @route  PUT /updatestatus/:id
// @desc   Change user task status
// @access Private
const updateTaskStatus = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(400);
            throw new Error("Task not found!");
        }
        // checking for user
        const userId = decodedToken.user_id;
        // makes sure the logged in user matches the user of the task
        if (task.user.toString() !== userId) {
            res.status(401);
            throw new Error("User not authorized!");
        }
        const taskStatus = task.completed;
        task.completed = !taskStatus;
        await task.save();
        res.status(200).json({
            success: true,
            message: "Task Status changed successfully!",
            completed: task.completed,
            task:task
        });
    } catch(err) {
        res.status(500).json({ message: "Failed to update task status" });
        console.log(err);
    }
};

// @route  DELETE /task/:id
// @desc   Delete user task
// @access Private
const deleteTask = async (req, res) => {
    try {   
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(400);
            throw new Error("Task not found!");
        }  
        const userId = decodedToken.user_id;
        // makes sure the logged in user matches the user of the task
        if (task.user.toString() !== userId) {
            res.status(401);
            throw new Error("User not authorized!");
        }

        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch(err) {
        res.status(500).json({ message: "Failed to delete task" });
        console.log(err);
    }
};

module.exports = {
    getTasks,
    getTask,
    getCompletedTasks,
    getIncompletedTasks,
    addTask,
    updateTaskContent,
    updateTaskStatus,
    deleteTask,
};
