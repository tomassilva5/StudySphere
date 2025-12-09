import chatDb from "../db/chat.db"
import Chat from "../types/chat.dto"

export default {
    create_chat(data:Chat){
       return chatDb.createChat(data)
    },
    getChats(userId:string){
        return chatDb.getChats(userId)
    },
}