import {prisma} from "../lib/prisma";
import UserDTO from "../types/user.dto";
import bcrypt from "bcryptjs";
export default {
    findAll(){
        return prisma.utilizador.findMany()
    },
    async create_user(data:UserDTO){
        const hashed_password = await bcrypt.hash(data.password, 14)
        return prisma.utilizador.create({ data: {
            username: data.username,
            email: data.email,
            password: hashed_password,
            fullname: data.fullname
        }})
    },
    getNames(){
        return prisma.utilizador.findMany({
            select:{
                username:true
            }
        })
    },
    getUser(data:UserDTO){
        return prisma.utilizador.findMany({
            select:{
                username:true,
                password:true
            }
        })
    },
}