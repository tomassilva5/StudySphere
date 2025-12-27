import { Request, Response } from "express";
import grupoService from "../services/grupo.service";
import { GrupoCreateDTO, GrupoAddUsersDTO } from "../types/grupo.dto";

export default {
    async createGrupo(req:Request, res:Response){
        try {
            const data:GrupoCreateDTO = req.body
            const newGroup = await grupoService.createGrupo(data)
            res.status(201).json(newGroup)
        } catch (error) {
            res.status(500).json({ message: "Error creating group", error })
        }
    },
    async leaveGrupo(req:Request, res:Response){
        try {
            const userId = req.user!.id;
            const groupId = req.params.id;
            await grupoService.leaveGrupo(userId, groupId)
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ message: "Error leaving group", error })
        }
    },
    async addMembers(req:Request, res:Response){
        try {
            const data:GrupoAddUsersDTO = req.body
            const updatedGroup = await grupoService.addMembers(data)
            res.status(200).json(updatedGroup)
        } catch (error) {
            res.status(500).json({ message: "Error adding members to group", error })
        }
    }
}