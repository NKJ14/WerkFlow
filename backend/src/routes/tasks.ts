import express from "express";
import authMiddleware from "../authMiddleware";
import { Prisma, PrismaClient,Category,Priority,Status } from "@prisma/client";
import jwt from "jsonwebtoken";
import {z} from "zod";
import cors from "cors";
const router = express.Router();
const prisma = new PrismaClient();
router.use(cors());
router.use(express.json());
router.get('/',authMiddleware,async (req,res)=>{
    //look up db and get tasks. All prisma stuff
    //I expect token. I return tasks.
    const token = req.headers.authorization;
    const decoded = jwt.decode((token as string).slice(7)) as { email?: string };
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
    const token = req.headers.authorization;
    const decoded = jwt.decode((token as string).slice(7)) as { email?: string };
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

const createBody = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  priority: z.string(),
  status: z.string()
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    // Fire a request to add a task and post it in the db
    console.log(req.body);
    const { success } = createBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
          message: "Error while creating information"
      });
    };
    const token = req.headers.authorization;
    const decoded = jwt.decode((token as string).slice(7)) as { email?: string };
    const mail = decoded?.email;
    if (!mail) {
      return res.status(400).json({ 
        msg: 'Invalid or missing email in the token' 
      });
    }
    const dateToday = new Date();
    const category :Category= req.body.category;
    const priority :Priority= req.body.priority;
    const status :Status= req.body.status;
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category,
        priority,
        status,
        dueDate: dateToday,
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
const updateBody = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
})
router.put('/:id',authMiddleware,async (req,res)=>{
    //edit the task
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
          message: "Error while updating information"
      });
  };
  const token = req.headers.authorization;
  const decoded = jwt.decode((token as string).slice(7)) as { email?: string };
  const mail = decoded?.email;
    const id = Number.parseInt(req.params.id);
    const category :Category= req.body.category;
    const priority :Priority= req.body.priority;
    const status :Status= req.body.status;
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
        userEmail: mail,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        category,
        priority,
        status,
        dueDate: new Date(),
      },
    });
    
    res.json({
      msg:"Success!",
      task:id,
      updatedTask
    })
});

router.delete('/:id',authMiddleware,async (req,res)=>{
  const token = req.headers.authorization;
  const decoded = jwt.decode((token as string).slice(7)) as { email?: string };
  const mail = decoded?.email;
    const id = parseInt(req.params.id);
    //delete the task
    const existingTask = await prisma.user.findUnique({
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

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await prisma.user.delete({
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

    res.status(200).json({
      msg:"deletion sucessful!"
    }); 
})
export default router;