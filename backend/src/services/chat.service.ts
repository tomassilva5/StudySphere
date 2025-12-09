import { get } from "http"
import chatDb from "../db/chat.db"
import Chat from "../types/chat.dto"

export default {
    create_chat(data:Chat){
       return chatDb.createChat(data)
    },
    getChats(userId:string){
        return chatDb.getChats(userId)
    },
    getMessages(chatId:string){
        return chatDb.getMessages(chatId)
    },
    sendMessage(message:any){
        return chatDb.sendMessage(message)
    },
    markAsRead(messageId:string, userId:string){
        return chatDb.markAsRead(messageId, userId)
    }
}