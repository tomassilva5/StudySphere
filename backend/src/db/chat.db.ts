import {prisma} from "../lib/prisma";
import { Conversa, Mensagem } from "../types/chat.dto";

export default {
    createChat(data:Conversa){
       return prisma.conversa.create({
           data: {
               nome: data.nome,
               membros: data.membros,
               tipo: data.tipo,
           }
       })
    },
    getChats(userId:string){
        return prisma.conversa.findMany({
            where: {
                membros: {
                    has: userId
                }
            }
        })
    },
    getMessages(chatId:string){
        return prisma.mensagem.findMany({
            where:{
                conversa_id: chatId
            },
            orderBy:{
                data_envio:'desc'
            },
        })
    },
    sendMessage(message:Mensagem){
        return prisma.mensagem.create({
            data:{
                remetente_id: message.remetente_id,
                conteudo: message.conteudo,
                conversa_id: message.conversa_id,
                caminho_ficheiro: message.caminho_ficheiro,
            }
        })
    },
    markAsRead(messageId:string, userId:string){
        return prisma.mensagem.updateMany({ 
            where: { 
                id:messageId,
                NOT:{
                    lido_por:{
                        has:userId
                    }
                }
            },
            data:{
                lido_por:{
                    push:userId
                }
            }
        })
    }
}