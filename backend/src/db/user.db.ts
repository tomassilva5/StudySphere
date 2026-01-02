import {prisma} from "../lib/prisma";
import { UserCreateDTO, UserLogin } from "../types/user.dto";
import bcrypt from "bcryptjs";

export default {
    findAll() {
        return prisma.utilizador.findMany();
    },

    async create_user(data: UserCreateDTO) {
        const hashed_password = await bcrypt.hash(data.palavra_passe, 14);

        return prisma.utilizador.create({
            data: {
                nome_utilizador: data.nome_utilizador,
                email: data.email,
                palavra_passe: hashed_password,
                nome_completo: data.nome_completo,
            },
        });
    },

    async getNames() {
        const users = await prisma.utilizador.findMany({
            select: {
                nome_utilizador: true,
            },
        });
        return users.map((user) => user.nome_utilizador);
    },

    async searchUsernames(username: string) {
        const user = await prisma.utilizador.findUnique({
            where: {
                nome_utilizador: username,
            },
            select: {
                nome_utilizador: true,
            },
        });
        return user;
    },

    async verifypassword(data: UserLogin) {
        if (!data.nome_utilizador && !data.email) {
            return false;
        }

        const where = data.nome_utilizador ? { nome_utilizador: data.nome_utilizador } : { email: data.email! };

        const user = await prisma.utilizador.findUnique({
            where,
        });

        if (!user) {
            return false;
        }

        return bcrypt.compare(data.palavra_passe, user.palavra_passe);
    },

    async isUsernameIn(username: string) {
        const user = await prisma.utilizador.findUnique({
            where: {
                nome_utilizador: username,
            },
        });
        return !!user;
    },

    async isEmailIn(email: string) {
        const user = await prisma.utilizador.findUnique({
            where: {
                email,
            },
        });
        return !!user;
    },

    async idByEmail(email: string) {
        const user = await prisma.utilizador.findUnique({
            where: { email: email },
            select: { id: true },
        });
        return user?.id;
    },

    async idByUsername(username: string) {
        const user = await prisma.utilizador.findUnique({
            where: { nome_utilizador: username },
            select: { id: true },
        });
        return user?.id;
    },

    async getById(id: string) {
        return prisma.utilizador.findUnique({
            where: { id },
        });
    },
};