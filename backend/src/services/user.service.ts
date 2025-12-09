import userDb from "../db/user.db";
import UserDTO from "../types/user.dto";
export default {
    getAll(){
        return userDb.findAll()
    },
    create(data:UserDTO){
        return userDb.create_user(data)
    },
    loginUser(data:UserDTO){
        return userDb.verifypassword(data)
    },
    getUsernames(){
        return userDb.getNames()
    },
    getSpecificUsernames(username:string){
        return  userDb.getVariousUsernames(username)
    },
    userExists(username:string){
        return userDb.isUsernameIn(username)
    },
}