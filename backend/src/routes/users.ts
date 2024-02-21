import express from "express";
import jwt from "jsonwebtoken";
import  JWT_SECRET from "../config";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../authMiddleware";
import cors from "cors";
const prisma =new PrismaClient();
//here
// backend/src/routes/user.ts
const router = express.Router();
router.use(express.json());
router.use(cors());
const signupBody = z.object({
    email: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string()
});

router.post("/signup", async (req, res) => {
    console.log(req.body);
    const  {success} = signupBody.safeParse(req.body);
    //check if inputs are correct
    if (!success) {
        console.log(success);
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    } 
    const existingUser = await prisma.user.findFirst({
        where:{
            email:req.body.email
        }
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }
    //now confirmed user ain't there, now create
    const user = await prisma.user.create({
        data:{
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }
    });

    res.json({
        message: "User created successfully"
    })

})

const signinBody = z.object({
    email: z.string().email(),
	password: z.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await prisma.user.findUnique({
        where:{
            email: req.body.email,
            password: req.body.password
        }
    });

    if (user) {
        const token = jwt.sign({
            email: user.email
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
});

//forgot password route
const updateBody = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    const token = req.headers.token;
    const decoded = jwt.decode((token as string).substring(7));

    const updateUser = await prisma.user.update({
        where: {
            email: (decoded as string),
        },
        data: {
            password: req.body.password ?? undefined,
            firstName: req.body.firstName ?? undefined,
            lastName: req.body.lastName ?? undefined,
        },
    });

    res.json({
        message: "Updated successfully"
    });
});
export default router;