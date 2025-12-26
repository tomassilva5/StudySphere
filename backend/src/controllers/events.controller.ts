import eventsService from "../services/events.service"
import { Request, Response } from "express";
import { EventCreateDTO, EventoUpdate } from "../types/events.dto";

export default {
    async createEvent(req:Request, res:Response){
        try {
            const data:EventCreateDTO = req.body;
            data.utilizador_id = req.user!.id;
            const event = await eventsService.createEvent(data);
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ message: "Error creating event", error });
        }
    }, 
    async createGroupEvent(req:Request, res:Response){
        try {
            const data:EventCreateDTO = req.body;
            data.utilizador_id = req.user!.id;
            const event = await eventsService.createGroupEvent(data);
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ message: "Error creating group event", error });
        }
    },
    async getTodayEvents(req:Request, res:Response){
        try {
            const userId = req.user!.id;
            const events = await eventsService.getTodayEvents(userId);
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: "Error getting today's events", error });
        }
    },
    async modifyEvents(req:Request, res:Response){
        try {
            const { id } = req.params;
            const input: EventoUpdate = req.body;
            const events = await eventsService.modifyEvents(id, input);
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: "Error modifying event", error });
        }
    }
}