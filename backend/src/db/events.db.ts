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
    }
}