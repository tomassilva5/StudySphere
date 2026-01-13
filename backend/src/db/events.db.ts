import {prisma} from "../lib/prisma";
import { EventCreateDTO, EventoUpdate } from "../types/events.dto";

export default{
    async createEvent(dto:EventCreateDTO){
        return prisma.evento.create({
            data:{
                titulo: dto.titulo,
                descricao: dto.descricao,
                data_inicio: new Date(dto.data_inicio),
                estado: dto.estado,
                data_fim: new Date(dto.data_fim),
                e_virtual: dto.e_virtual,
                link_reuniao: dto.link_reuniao,
                prioridade: dto.prioridade,
                categoria: dto.categoria,
                etiquetas: dto.etiquetas,
                recorrencia: dto.recorrencia,
                utilizador_id: dto.utilizador_id,
                sincronizacao_externa: dto.sincronizacao_externa,
            }
        })
    },
    async createGroupEvent(dto:EventCreateDTO){
        return prisma.evento.create({
            data:{
                titulo: dto.titulo,
                descricao: dto.descricao,
                data_inicio: new Date(dto.data_inicio),
                estado: dto.estado,
                data_fim: new Date(dto.data_fim),
                e_virtual: dto.e_virtual,
                link_reuniao: dto.link_reuniao,
                prioridade: dto.prioridade,
                categoria: dto.categoria,
                etiquetas: dto.etiquetas,
                recorrencia: dto.recorrencia,
                utilizador_id: dto.utilizador_id,
                sincronizacao_externa: dto.sincronizacao_externa,
                grupos_evento: {
                  create: {
                    grupo: {
                      connect: { id: dto.grupo_id },
                    },
                  },
                },
            }
        })
    },
    async getTodayEvents(userId:string){
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)    
        const startOfTomorrow = new Date(startOfToday)
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)
        return prisma.evento.findMany({
            where:{
                data_inicio: {
                    gte: startOfToday,
                },
                data_fim: {
                    lt: startOfTomorrow,
                }
                ,
                utilizador_id: userId,
            },
            orderBy:{
                data_fim:'asc'
            }
        })
    },
    async modifyEvents(id:string , input:EventoUpdate){
        const data: any = {}
        for (const [key, value] of Object.entries(input)) {
          if (value !== undefined) {
            if (key === 'data_inicio' || key === 'data_fim') {
                data[key] = new Date(value as string);
            } else {
                data[key] = value
            }
          }
        }
        return prisma.evento.update({
            where: { id },
            data,
        })
    },
    async deleteEvent(id:string, userId:string){
        // Verificar se o evento existe
        const evento = await prisma.evento.findUnique({
            where: { id },
            include: {
                grupos_evento: {
                    include: {
                        grupo: {
                            include: {
                                membros: {
                                    where: {
                                        utilizador_id: userId
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if (!evento) {
            throw new Error('Event not found');
        }
        
        // Verificar se é evento do utilizador ou se é evento de um grupo onde o utilizador é membro
        const isOwner = evento.utilizador_id === userId;
        const isGroupMember = evento.grupos_evento.some(ge => 
            ge.grupo.membros.length > 0
        );
        
        if (!isOwner && !isGroupMember) {
            throw new Error('Unauthorized');
        }
        
        return prisma.evento.delete({
            where: { id },
        });
    },
    async addEventToGroup(eventoId: string, grupoId: string, userId: string) {
        // Verificar se o evento pertence ao utilizador
        const evento = await prisma.evento.findUnique({
            where: { id: eventoId },
        });
        
        if (!evento) {
            throw new Error('Event not found');
        }
        
        if (evento.utilizador_id !== userId) {
            throw new Error('Unauthorized');
        }
        
        // Verificar se o utilizador é membro do grupo
        const isMember = await prisma.grupoUtilizador.findFirst({
            where: {
                grupo_id: grupoId,
                utilizador_id: userId,
            },
        });
        
        if (!isMember) {
            throw new Error('User is not a member of this group');
        }
        
        // Adicionar evento ao grupo
        return prisma.eventoGrupo.create({
            data: {
                evento_id: eventoId,
                grupo_id: grupoId,
            },
        });
    }
}