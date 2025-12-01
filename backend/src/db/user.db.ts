import {prisma} from "../lib/prisma";
import UserDTO from "../types/user.dto";

export default {
    findAll(){
        return prisma.utilizador.findMany()
    },
    create_user(data:UserDTO){
        return prisma.utilizador.create({ data: {
            username: data.username,
            email: data.email,
            password: data.password,
            fullname: data.fullname
        }})
    },
    getNames(){
        return prisma.utilizador.findMany({
            select:{
                username:true
            }
        })
    }
}