import express from "express";
import jwt from "jsonwebtoken";
import  JWT_SECRET from "../config";
import zod from "zod";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../authMiddleware";
const prisma =new PrismaClient();
//here
// backend/src/routes/user.ts
const router = express.Router();

const signupBody = zod.object({
    email: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    //check if inputs are correct
    if (!success) {
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
    })
    const userId = user.email;
    //sign and return a jwt token
    const token = jwt.sign({
        email: userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
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
            userId: user.email
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
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
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