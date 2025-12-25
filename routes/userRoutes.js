const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken')

router.post("/login",userController.login);
router.post("/register", userController.register);
router.get("/check-auth", verifyToken, userController.checkAuth);
router.get("/todos", verifyToken , userController.getTask);
router.post("/todos", verifyToken, userController.createTask);
router.put("/todos/:id", verifyToken, userController.updateTask);
router.delete("/todos/:id", verifyToken, userController.deleteTask);

module.exports = router;
