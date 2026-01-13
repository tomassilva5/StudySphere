import userService from "../services/user.service";
import { UserCreateDTO } from "../types/user.dto";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export default {
    async getCurrentUser(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await userService.getById(userId);
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            res.json(user);
        } catch (error) {
            console.error('Error getting current user:', error);
            res.status(500).json({ message: "Error getting current user" });
        }
    },

    async getGoogleStatus(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await userService.getById(userId);
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const hasGoogleToken = !!(user.google_access_token && user.google_refresh_token);
            res.json({ connected: hasGoogleToken });
        } catch (error) {
            console.error('Error getting Google status:', error);
            res.status(500).json({ message: "Error getting Google status" });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error getting all users" });
        }
    },

    async checkAvailability(req: Request, res: Response) {
        try {
            const { username, email } = req.query;

            if (username) {
                const exists = await userService.userExists(username as string);
                return res.json({ available: !exists });
            }

            if (email) {
                const exists = await userService.emailExists(email as string);
                return res.json({ available: !exists });
            }

            return res.status(400).json({ message: "Missing username or email parameter" });
        } catch (error) {
            res.status(500).json({ message: "Error checking availability" });
        }
    },

    async searchUsers(req: Request, res: Response) {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string') {
                return res.json([]);
            }

            const users = await userService.searchUsers(q);
            res.json(users);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ message: "Error searching users" });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const data: UserCreateDTO = req.body;
            
            const userExists = await userService.userExists(data.nome_utilizador);
            if (userExists) {
                return res.status(409).json({ message: "Nome de utilizador já em uso" });
            }

            const emailExists = await userService.emailExists(data.email);
            if (emailExists) {
                return res.status(409).json({ message: "Este email já está registado" });
            }

            const user = await userService.create(data);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                const target = Array.isArray(error.meta?.target) ? error.meta?.target.join(", ") : "field";
                return res.status(409).json({ message: `Conflito de dados: ${target}` });
            }
            res.status(500).json({ message: "Erro ao criar utilizador" });
        }
    },

    async getUsernames(req: Request, res: Response) {
        try {
            const users = await userService.getUsernames();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error getting usernames" });
        }
    },

    async getUser(req: Request, res: Response) {
        try {
            const { nome_utilizador } = req.params;
            const user = await userService.getSpecificUsernames(nome_utilizador);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error getting user" });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.getById(id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error getting user" });
        }
    }
};