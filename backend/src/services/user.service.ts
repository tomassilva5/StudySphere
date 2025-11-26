import userDb from "../db/user.db";
import UserDTO from "../types/user.dto";
export default {
    getAll(){
        return userDb.findAll()
    },
    create(data:UserDTO){
        return userDb.create_user(data)
    }
}