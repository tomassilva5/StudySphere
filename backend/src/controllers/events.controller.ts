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
    },
    async deleteEvent(req:Request, res:Response){
        try {
            const { id } = req.params;
            const userId = req.user!.id;
            await eventsService.deleteEvent(id, userId);
            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting event", error });
        }
    },
    async addEventToGroup(req:Request, res:Response){
        try {
            const { id } = req.params;
            const { grupo_id } = req.body;
            const userId = req.user!.id;
            
            if (!grupo_id) {
                return res.status(400).json({ message: "grupo_id is required" });
            }
            
            const result = await eventsService.addEventToGroup(id, grupo_id, userId);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.message === 'Event not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'Unauthorized' || error.message === 'User is not a member of this group') {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: "Error adding event to group", error });
        }
    }
}