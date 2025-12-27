import chatDb from "../db/chat.db"
import {Conversa, Mensagem} from "../types/chat.dto"

export default {
    create_chat(data:Conversa){
       return chatDb.createChat(data)
    },
    getChats(userId:string){
        return chatDb.getChats(userId)
    },
    getMessages(chatId:string){
        return chatDb.getMessages(chatId)
    },
    sendMessage(message:Mensagem){
        return chatDb.sendMessage(message)
    },
    markAsRead(messageId:string, userId:string){
        return chatDb.markAsRead(messageId, userId)
    }
}