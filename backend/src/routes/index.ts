import express from "express";
import userRouter from "./users";
import Task from "../assets/tasks";
const router = express.Router();

router.use('/user',userRouter);

router.get('/tasks',(req,res)=>{
    //look up db and get tasks. All prisma stuff
});
router.get('/tasks/:id',(req,res)=>{
    //look up db and get tasks by id
});

router.post('/tasks',(req,res)=>{
    //fire a request to add a task and post it in db
});

router.put('/tasks/:id',(req,res)=>{
    //edit the task
});

router.delete('tasks/:id',(req,res)=>{
    //delete the task 
})
export default router;