import { tipo_conversa } from "@prisma/client";

export interface Conversa{
    nome:string;
    membros:string[];
    tipo: tipo_conversa;
}

export interface Mensagem{
    remetente_id:string
    conteudo:string
    conversa_id:string
    caminho_ficheiro:string
}