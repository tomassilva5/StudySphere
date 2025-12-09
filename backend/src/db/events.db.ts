import {prisma} from "../lib/prisma";
import Evento, { EventoUpdate } from "../types/events.dto";

export default{
    async createEvent(dto:Evento){
        return prisma.evento.create({
            data:{
                title: dto.title,
                description: dto.description,
                startDate: new Date(dto.startDate),
                status: dto.status,
                endDate: new Date(dto.endDate),
                isVirtual: dto.isVirtual,
                meetingLink: dto.meetingLink,
                priority: dto.priority,
                category: dto.category,
                recurrence: dto.recurrence,
                userId: dto.userId,
                externalSync: dto.externalSync,
            }
        })
    },
    async createGroupEvent(dto:Evento){
        return prisma.evento.create({
            data:{
                title: dto.title,
                description: dto.description,
                startDate: new Date(dto.startDate),
                status: dto.status,
                endDate: new Date(dto.endDate),
                isVirtual: dto.isVirtual,
                meetingLink: dto.meetingLink,
                priority: dto.priority,
                category: dto.category,
                recurrence: dto.recurrence,
                userId: dto.userId,
                externalSync: dto.externalSync,
                eventos: {
                  create: {
                    grupo: {
                      connect: { id: dto.groupId },
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
                startDate: {
                    gte: startOfToday,
                },
                endDate: {
                    lt: startOfTomorrow,
                }
                ,
                userId: userId,
            },
            orderBy:{
                endDate:'asc'
            }
        })
    },
    async modifyEvents(id:string , input:EventoUpdate){
        const data: any = {}
        for (const [key, value] of Object.entries(input)) {
          if (value !== undefined) data[key] = value
        }
        return prisma.evento.update({
            where: { id },
            data,
        })
    }
}