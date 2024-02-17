import express from "express";
import userRouter from "./users";
import taskRouter from "./tasks";
import cors from "cors";
const router = express.Router();
router.use(cors());
router.use('/user',userRouter);
router.use('/tasks',taskRouter);
export default router;