import {prisma} from "../lib/prisma";
import { GrupoCreateDTO, GrupoAddUsersDTO } from "../types/grupo.dto";

export default{
    async getUserGroups(userId:string){
        return prisma.grupo.findMany({
            where:{
                membros:{
                    some:{
                        utilizador_id: userId
                    }
                }
            },
            include:{
                membros: {
                    select: {
                        utilizador: {
                            select: {
                                id: true,
                                nome_utilizador: true,
                                nome_completo: true,
                            },
                        },
                    },
                },
                eventos_grupo: {
                    select: {
                        evento: {
                            select: {
                                id: true,
                                titulo: true,
                                estado: true,
                            }
                        }
                    }
                }
            }
        })
    },
    async getGroupById(groupId:string, userId:string){
        return prisma.grupo.findFirst({
            where:{
                id: groupId,
                membros:{
                    some:{
                        utilizador_id: userId
                    }
                }
            },
            include:{
                membros: {
                    select: {
                        utilizador: {
                            select: {
                                id: true,
                                nome_utilizador: true,
                                nome_completo: true,
                            },
                        },
                    },
                },
                eventos_grupo: {
                    include: {
                        evento: {
                            include: {
                                proprietario: {
                                    select: {
                                        id: true,
                                        nome_utilizador: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    },
    async createGrupo(dto:GrupoCreateDTO){
        // Buscar o nome do utilizador criador se fornecido
        let criadorNomeUtilizador: string | null = null;
        if (dto.criador_id) {
            const criador = await prisma.utilizador.findUnique({
                where: { id: dto.criador_id },
                select: { nome_utilizador: true }
            });
            criadorNomeUtilizador = criador?.nome_utilizador || null;
        }

        // Criar array de membros incluindo o criador
        const membersToAdd = [
            ...(dto.membrosNomeUtilizador || []).map((nome_utilizador) => ({
                utilizador: {
                    connect: { nome_utilizador },
                },
            }))
        ];

        // Adicionar o criador como membro se encontrado e não já incluído
        if (criadorNomeUtilizador && !dto.membrosNomeUtilizador?.includes(criadorNomeUtilizador)) {
            membersToAdd.push({
                utilizador: {
                    connect: { nome_utilizador: criadorNomeUtilizador },
                },
            });
        }

        return prisma.grupo.create({
            data:{
                nome: dto.nome,
                descricao: dto.descricao,
                membros:{
                    create: membersToAdd
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