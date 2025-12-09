import { Response,Request } from "express";
import chatService from "../services/chat.service";
import Chat from "../types/chat.dto";

export default{
    async createChat(req:Request, res:Response){
        const data:Chat = req.body
        await chatService.create_chat(data)
        res.status(201)
    },
    async getChats(req:Request, res:Response){
        const { userId } = req.body
        const chats = await chatService.getChats(userId)
        res.status(200).json(chats)
    }
}