import express from "express";
import jwt from "jsonwebtoken";
import  JWT_SECRET from "./config";
import zod from "zod";
//here
// backend/src/routes/user.ts
const userRouter = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

userRouter.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    //find one user by name
    //if exists, do
    // if (existingUser) {
    //     return res.status(411).json({
    //         message: "Email already taken/Incorrect inputs"
    //     })
    // }

    //if not? create user by the details, sign a jwt using JWT_SECRET and return a response
    res.json({
        message: "User created successfully",
        token: 12 //Placeholder for token, remove when addressed
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

userRouter.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    //Find user from db, if there return a jwt token else give status code 411
})

export default userRouter;