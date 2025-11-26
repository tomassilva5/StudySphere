import {prisma} from "../lib/prisma";
import UserDTO from "../types/user.dto";

export default {
    findAll(){
        return prisma.utilizador.findMany()
    },
    create_user(data:UserDTO){
        return prisma.utilizador.create({data})
    }
}