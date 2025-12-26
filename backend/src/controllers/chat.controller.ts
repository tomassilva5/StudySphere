import { Response,Request } from "express";
import chatService from "../services/chat.service";
import {Conversa, Mensagem} from "../types/chat.dto";

export default{
    async createChat(req:Request, res:Response){
        try {
            const data:Conversa = req.body;
            if (!data.membros.includes(req.user!.id)) {
                data.membros.push(req.user!.id);
            }
            const newChat = await chatService.create_chat(data)
            res.status(201).json(newChat)
        } catch (error) {
            res.status(500).json({ message: "Error creating chat", error })
        }
    },
    async getChats(req:Request, res:Response){
        try {
            const userId = req.user!.id;
            const chats = await chatService.getChats(userId)
            res.status(200).json(chats)
        } catch (error) {
            res.status(500).json({ message: "Error getting chats", error })
        }
    },
    async getMessages(req:Request, res:Response){
        try {
            const { chatId } = req.params;
            const messages = await chatService.getMessages(chatId)
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ message: "Error getting messages", error })
        }
    },
    async sendMessage(req:Request, res:Response){
        try {
            const message: Mensagem = req.body;
            message.remetente_id = req.user!.id;
            const newMessage = await chatService.sendMessage(message)
            res.status(201).json(newMessage)
        } catch (error) {
            res.status(500).json({ message: "Error sending message", error })
        }
    },
    async markAsRead(req:Request, res:Response){
        try {
            const { messageId } = req.body
            const userId = req.user!.id;
            await chatService.markAsRead(messageId, userId)
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ message: "Error marking message as read", error });
        }
    }
}