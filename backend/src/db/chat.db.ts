import {prisma} from "../lib/prisma";
import Chat from "../types/chat.dto";
import Message from "../types/chat.dto";

export default {
    createChat(data:Chat){
       return prisma.chat.create({data})
    },
    getChats(userId:string){
        return prisma.chat.findMany({
            where: {
                members: {
                    has: userId
                }
            }
        })
    },
    getMessages(chatId:string){
        return prisma.message.findMany({
            where:{
                chatId
            },
            orderBy:{
                timestamp:'desc'
            },
        })
    },
    sendMessage(message:Message){
        return prisma.message.create({
            data:{
                senderId: message.userid,
                content: message.content,
                chatId: message.chatid,
            }
        })
    },
    markAsRead(messageId:string, userId:string){
        return prisma.message.updateMany({ 
            where: { 
                id:messageId,
                NOT:{
                    readBy:{
                        has:userId
                    }
                }
            },
            data:{
                readBy:{
                    push:userId
                }
            }
        })
    }
}