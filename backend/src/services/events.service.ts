import eventsDb from "../db/events.db"
import Evento, { EventoUpdate } from "../types/events.dto"

export default{
    createEvent(dto:Evento){
        return eventsDb.createEvent(dto)
    },
    createGroupEvent(dto:Evento){
        return eventsDb.createGroupEvent(dto)
    },
    getTodayEvents(userId:string){
        return eventsDb.getTodayEvents(userId)
    },
    modifyEvents(id:string , input:EventoUpdate){
        return eventsDb.modifyEvents(id, input)
    }
}