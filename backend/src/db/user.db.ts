import { verify } from "crypto";
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
    async getNames(){
        const users = await prisma.utilizador.findMany({
            select:{
                username:true
            }
        })
        const usernames = users.map((user: { username: any; }) => user.username)
        return usernames
    },
    async getVariousUsernames(username:string){
        const users = await prisma.utilizador.findMany({
            where:{
                username: {
                    contains: username,
                    mode: 'insensitive'
                }
            }
        })
        const usernames = users.map((user: { username: any; }) => user.username)
        return usernames
    },
    async getUser(data:UserDTO){
        const user = await prisma.utilizador.findUnique({
            where:{
                username: data.username
            }
        })
        if(!user) return false
        const result = await bcrypt.compare(data.password, user.password)
        return result
    },
    async isUsernameIn(username:string){
        const usernames = await prisma.utilizador.findMany({
            where:{
                username: {
                    contains: username,
                    mode: 'insensitive'
                }
            }
        })
        const bool = usernames ? true : false
        return bool
    }
}