export interface GrupoCreateDTO {
    nome:string
    descricao:string
    membrosNomeUtilizador:string[]
}
export interface GrupoAddUsersDTO {
    grupoId:string
    membrosNomeUtilizador:string[]
}