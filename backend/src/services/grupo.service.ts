import grupoDb from "../db/grupo.db"
import { GrupoCreateDTO, GrupoAddUsersDTO } from "../types/grupo.dto"

export default{
    getUserGroups(userId:string){
        return grupoDb.getUserGroups(userId)
    },
    getGroupById(groupId:string, userId:string){
        return grupoDb.getGroupById(groupId, userId)
    },
    createGrupo(dto:GrupoCreateDTO){
        return grupoDb.createGrupo(dto)
    },
    leaveGrupo(userId:string, groupId:string){
        return grupoDb.leaveGrupo(userId, groupId)
    },
    addMembers(dto:GrupoAddUsersDTO){
        return grupoDb.addMembers(dto)
    }
}