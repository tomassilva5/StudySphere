export default interface Grupo{
    name:string
    description:string
    membersUsername:string[]
}
export default interface GrupoAddusers{
    grupoId:string
    membersUsername:string[]
}