import userService from "../services/user.service";
import UserDTO from "../types/user.dto";

export default {
    async getAll(req, res){
        const users = await userService.getAll()
        res.json(users)
    },
    async create(req, res){
        const data:UserDTO = req.body
        const user = await userService.create(data)
        res.status(201).json(user)
    }
}