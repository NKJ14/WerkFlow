import express from "express";
import authMiddleware from "../authMiddleware";
import { Prisma, PrismaClient } from "@prisma/client";
const router = express.Router();
import jwt from "jsonwebtoken";
import zod from "zod";
const prisma = new PrismaClient();
router.get('/',authMiddleware,async (req,res)=>{
    //look up db and get tasks. All prisma stuff
    //I expect token. I return tasks.
    const token = req.headers.token;
    const decoded = jwt.decode((token as string).substring(7)) as { email?: string };
    const mail = decoded?.email;
    const userWithTasks = await prisma.user.findUnique({
        where: {
          email: mail
        },
        include: {
          tasks: true
        }
      });
      res.json({
        msg:"Success!",
        tasks:userWithTasks
      })
});
router.get('/:id',authMiddleware,async (req,res)=>{
    //look up db and get tasks by id
    const token = req.headers.token;
    const decoded = jwt.decode((token as string).substring(7)) as { email?: string };
    const mail = decoded?.email;
    const id = Number.parseInt(req.params.id); 
    const taskById = await prisma.user.findUnique({
        where: {
          email: mail,
        },
        include: {
          tasks: {
            where: {
              id: id,
            },
          },
        },
      });
      
      res.json({
        msg:"Success!",
        task:taskById
      })
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    // Fire a request to add a task and post it in the db
    const token = req.headers.token;
    const decoded = jwt.decode((token as string).substring(7)) as { email?: string };
    const mail = decoded?.email;

    if (!mail) {
      return res.status(400).json({ 
        msg: 'Invalid or missing email in the token' 
      });
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
        comments: req.body.comments,
        userEmail: mail,
      },
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})
const updateBody = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
  category: zod.string().optional(),
  priority: zod.string().optional(),
  status: zod.string().optional(),
  dueDate: zod.date().optional(),
})
router.put('/:id',authMiddleware,async (req,res)=>{
    //edit the task
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
          message: "Error while updating information"
      });
  };
    const token = req.headers.token;
    const decoded = jwt.decode((token as string).substring(7)) as { email?: string };
    const mail = decoded?.email;
    const id = Number.parseInt(req.params.id);
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
        userEmail: mail,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
      },
    });
    
    res.json({
      msg:"Success!",
      task:id
    })
});

router.delete('/:id',authMiddleware,async (req,res)=>{
    const taskId = parseInt(req.params.id);
    //delete the task
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(200).json({
      msg:"deletion sucessful!"
    }); 
})
export default router;