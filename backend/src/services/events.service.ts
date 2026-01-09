import eventsDb from "../db/events.db"
import { EventCreateDTO, EventoUpdate } from "../types/events.dto"

export default{
    createEvent(dto:EventCreateDTO){
        return eventsDb.createEvent(dto)
    },
    createGroupEvent(dto:EventCreateDTO){
        return eventsDb.createGroupEvent(dto)
    },
    getTodayEvents(userId:string){
        return eventsDb.getTodayEvents(userId)
    },
    modifyEvents(id:string , input:EventoUpdate){
        return eventsDb.modifyEvents(id, input)
    },
    deleteEvent(id:string, userId:string){
        return eventsDb.deleteEvent(id, userId)    },
    async addEventToGroup(eventoId: string, grupoId: string, userId: string){
        return eventsDb.addEventToGroup(eventoId, grupoId, userId);
    }
}