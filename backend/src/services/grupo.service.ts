import grupoDb from "../db/grupo.db"
import Grupo from "../types/grupo.dto"
import GrupoAddusers from "../types/grupo.dto"

export default{
    createGrupo(dto:Grupo){
        return grupoDb.createGrupo(dto)
    },
    leaveGrupo(userId:string, groupId:string){
        return grupoDb.leaveGrupo(userId, groupId)
    },
    addMembers(dto:GrupoAddusers){
        return grupoDb.addMembers(dto)
    }
}