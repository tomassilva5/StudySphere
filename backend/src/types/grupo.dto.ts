export interface GrupoCreateDTO {
    nome:string
    descricao:string
    membrosNomeUtilizador:string[]
    criador_id?:string
}
export interface GrupoAddUsersDTO {
    grupoId:string
    membrosNomeUtilizador:string[]
}