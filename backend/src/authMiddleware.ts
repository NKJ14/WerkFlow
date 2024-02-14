import JWT_SECRET from "./config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization ;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Authorization header missing or invalid." });
    }
    // console.log(authHeader);
    // const decoded = jwt.verify(removeBearer(authHeader), JWT_SECRET);
    // req.mail = decoded.email;
    // return res.status(500).json({
    //     msg:"Balls"
    // })
    try {
        const decoded = jwt.verify(authHeader.slice(7),JWT_SECRET) as {email?:string};
        next();

    } catch (err) {
        console.log("Authentication error:", err);
        return res.status(403).json({ message: "Error occurred. Invalid token." });
    }
};

export default authMiddleware;
