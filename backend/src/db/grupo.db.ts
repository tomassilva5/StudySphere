import {prisma} from "../lib/prisma";
import { GrupoCreateDTO, GrupoAddUsersDTO } from "../types/grupo.dto";

export default{
    async createGrupo(dto:GrupoCreateDTO){
        return prisma.grupo.create({
            data:{
                nome: dto.nome,
                descricao: dto.descricao,
                membros:{
                    create: dto.membrosNomeUtilizador.map((nome_utilizador) => ({
                        utilizador: {
                            connect: { nome_utilizador },
                        },
                    }))
                }
            },
            include:{
                membros: {
                    select: {
                        utilizador: {
                            select: {
                                id: true,
                                nome_utilizador: true,
                            },
                        },
                    },
                }
            }
        })
    },
    async leaveGrupo(userId:string, groupId:string){
        return prisma.grupoUtilizador.delete({
            where: {
                grupo_id_utilizador_id: {
                    grupo_id: groupId,
                    utilizador_id: userId,
                },
            },
            
        })
    },
    async addMembers(dto:GrupoAddUsersDTO){
        return prisma.grupo.update({
            where: {id: dto.grupoId},
            data:{
                membros:{
                    create: dto.membrosNomeUtilizador.map((nome_utilizador) => ({
                        utilizador: { 
                            connect: { nome_utilizador } 
                        },
                    })),
                },
            },
            include:{
                membros: {
                    select: {
                        utilizador: {
                            select: {
                                id: true,
                                nome_utilizador: true,
                            },
                        },
                    },
                }
            }
        })
    }
}