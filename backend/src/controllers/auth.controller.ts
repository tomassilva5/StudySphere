import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../helpers/config";

export function authController(req: Request, res:Response, next: NextFunction){
    const token = (req as any).cookies?.accessToken
    if (!token) return res.status(401).json({message:"Missing Token"})
    try{
        const payload =  jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
        (req as any).userId = payload.sub;
        next();
    } catch (err){
        return res.status(401).json({message: "Invalid/Expired Token"})
    }
}