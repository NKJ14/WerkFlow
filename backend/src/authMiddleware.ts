import  JWT_SECRET from "./config";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

interface JwtPayload{
    userId:string;
}   //type of decoded stuff
interface authedRequest extends Request{
    userId: string;
} // our request has userId attached inside so we make interface that extends normal (boilerplate) request
  
const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as authedRequest).userId = decoded.userId; // Type assertion here
        next();
    } catch (err) {
        return res.status(403).json({
            message:"errored out. Invalid stuff."
        });
    }
};

export default authMiddleware;
