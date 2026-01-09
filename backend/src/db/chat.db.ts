import {prisma} from "../lib/prisma";
import { Conversa, Mensagem } from "../types/chat.dto";

export default {
    async getGroupMessages(groupId: string, userId: string) {
        // Verificar se o utilizador é membro do grupo
        const isMember = await prisma.grupoUtilizador.findFirst({
            where: {
                grupo_id: groupId,
                utilizador_id: userId
            }
        });

        if (!isMember) {
            throw new Error('User is not a member of this group');
        }

        return prisma.mensagemGrupo.findMany({
            where: {
                grupo_id: groupId
            },
            select: {
                id: true,
                autor_id: true,
                mensagem: true,
                criado_em: true,
                autor: {
                    select: {
                        id: true,
                        nome_utilizador: true,
                        nome_completo: true,
                    }
                }
            },
            orderBy: {
                criado_em: 'asc'
            }
        });
    },

    async sendGroupMessage(groupId: string, userId: string, mensagem: string) {
        // Verificar se o utilizador é membro do grupo
        const isMember = await prisma.grupoUtilizador.findFirst({
            where: {
                grupo_id: groupId,
                utilizador_id: userId
            }
        });

        if (!isMember) {
            throw new Error('User is not a member of this group');
        }

        return prisma.mensagemGrupo.create({
            data: {
                grupo_id: groupId,
                autor_id: userId,
                mensagem: mensagem
            },
            select: {
                id: true,
                autor_id: true,
                mensagem: true,
                criado_em: true,
                autor: {
                    select: {
                        id: true,
                        nome_utilizador: true,
                        nome_completo: true,
                    }
                }
            }
        });
    },

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