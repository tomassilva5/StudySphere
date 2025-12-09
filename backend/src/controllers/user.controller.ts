import userService from "../services/user.service";
import CreateUserDTO from "../types/user.dto";
import UserDTO from "../types/user.dto";
import { Request, Response } from "express";
export default {
    async getAll(req:Request, res:Response){
        const users = await userService.getAll()
        res.json(users)
    },
    async getUser(req:Request, res:Response){
        const data:UserDTO = req.body;
        const users = await userService.loginUser(data)
        res.json(users)
    },
    async create(req:Request, res:Response){
        const data:CreateUserDTO = req.body
        const user = await userService.create(data)
        res.status(201)
    }
}