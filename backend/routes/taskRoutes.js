const { Router } = require('express');

const router = Router();
const {verifyUser} = require('../middlewares/authMiddleware');
const {getTasks, getTask, addTask, updateTaskContent, updateTaskStatus, deleteTask, getCompletedTasks, getIncompletedTasks } = require('../controllers/taskController');

router.get('/tasks', verifyUser, getTasks);
router.get('/tasks/completed', verifyUser, getCompletedTasks);
router.get('/tasks/incompleted', verifyUser, getIncompletedTasks);
router.get('/task/:id', verifyUser, getTask);
router.post('/task', verifyUser, addTask);
router.put('/updatecontent/:id', verifyUser, updateTaskContent);
router.put('/updatestatus/:id', verifyUser, updateTaskStatus);
router.delete('/task/:id', verifyUser, deleteTask);

module.exports = router;