import userService from "../services/user.service";
import { UserCreateDTO } from "../types/user.dto";
import { Request, Response } from "express";

export default {
    async getAll(req:Request, res:Response){
        try {
            const users = await userService.getAll()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: "Error getting all users" });
        }
    },
    async create(req:Request, res:Response){
        try {
            const data:UserCreateDTO = req.body
            const userExists = await userService.userExists(data.nome_utilizador);
            if (userExists) {
                return res.status(409).json({ message: "User already exists" });
            }
            const user = await userService.create(data)
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    },
    async getUsernames(req:Request, res:Response){
        try {
            const users = await userService.getUsernames()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: "Error getting usernames" });
        }
    },
    async getUser(req:Request, res:Response){
        try {
            const { nome_utilizador } = req.params
            const user = await userService.getSpecificUsernames(nome_utilizador)
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error getting user" });
        }
    },
    async getById(req:Request, res:Response){
        try {
            const { id } = req.params
            const user = await userService.getById(id)
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error getting user" });
        }
    }
}