import userDb from "../db/user.db";
import { UserCreateDTO, UserLogin } from "../types/user.dto";
export default {
    getAll(){
        return userDb.findAll()
    },
    create(data:UserCreateDTO){
        return userDb.create_user(data)
    },
    loginUser(data:UserLogin){
        return userDb.verifypassword(data)
    },
    getUsernames(){
        return userDb.getNames()
    },
    getSpecificUsernames(nome_utilizador:string){
        return  userDb.searchUsernames(nome_utilizador)
    },
    userExists(nome_utilizador:string){
        return userDb.isUsernameIn(nome_utilizador)
    },
    emailExists(email:string){
        return userDb.isEmailIn(email)
    },
    idByEmail(email:string){
        return userDb.idByEmail(email)
    },
    idByUsername(nome_utilizador:string){
        return userDb.idByUsername(nome_utilizador)
    },
    getById(id:string){
        return userDb.getById(id)
    },
    searchUsers(query: string){
        return userDb.searchUsers(query)
    }
}