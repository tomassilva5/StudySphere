import { categoria, estado_evento, prioridade } from "@prisma/client";

export interface EventCreateDTO {
    titulo:string;
    descricao?:string;
    data_inicio: string;  
    estado: estado_evento;
    data_fim: string;    
    e_virtual:boolean;
    link_reuniao?:string;
    prioridade: prioridade;
    categoria: categoria;
    etiquetas?:string;
    recorrencia?:any;
    sincronizacao_externa?:any;
    utilizador_id:string;
    grupo_id?:string;
}
export  interface EventoUpdate{
    titulo?:string;
    descricao?:string;
    data_inicio?: string;  
    estado?: estado_evento;
    data_fim?: string;    
    e_virtual?:boolean;
    link_reuniao?:string;
    prioridade?: prioridade;
    categoria?: categoria;
    etiquetas?:string;
    recorrencia?:any;
    sincronizacao_externa?:any;
    utilizador_id?:string;
    grupo_id?:string;
}