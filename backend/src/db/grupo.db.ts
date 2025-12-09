import {prisma} from "../lib/prisma";
import Grupo from "../types/grupo.dto";
import GrupoAddusers from "../types/grupo.dto";

export default{
    async createGrupo(dto:Grupo){
        return prisma.grupo.create({
            data:{
                name: dto.name,
                description: dto.description,
                members:{
                    create: dto.membersUsername.map((username) => ({
                        utilizador: {
                            connect: { username },
                        },
                    }))
                }
            },
            include:{
                members: {
                    include: {
                        utilizador: true,
                    },
                }
            }
        })
    },
    async leaveGrupo(userId:string, groupId:string){
        return prisma.grupoUtilizador.delete({
            where: {
                grupoId_utilizadorId: {
                    grupoId: groupId,
                    utilizadorId: userId,
                },
            },
            
        })
    },
    async addMembers(dto:GrupoAddusers){
        return prisma.grupo.update({
            where: {id: dto.grupoId},
            data:{
                members:{
                    create: dto.membersUsername.map((username) => ({
                        utilizador: { 
                            connect: { username } 
                        },
                    })),
                },
            },
            include:{
                members: {
                    include: {
                        utilizador: true,
                    },
                }
            }
        })
    }
}