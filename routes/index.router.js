const express = require('express'); 
const router = express.Router(); 

const commentRouter = require("./comment.router"); 
const userRouter = require("./user.router")
const quizRouter = require("./quiz.router"); 
const logInRouter = require("./auth.router"); 

router.use("/comment" , commentRouter); 
router.use("/user", userRouter); 
router.use("/quiz", quizRouter); 
router.use("/auth", logInRouter); 

module.exports = router; 


