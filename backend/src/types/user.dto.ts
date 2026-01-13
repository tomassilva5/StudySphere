export interface UserCreateDTO {
    nome_utilizador:string;
    nome_completo:string;
    email:string;
    palavra_passe:string;
}

export interface UserLogin {
    nome_utilizador?:string;
    palavra_passe:string;
    email?:string;
}
export interface UserUpdate {
    email?:string;
    palavra_passe:string;

}