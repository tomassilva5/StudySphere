export default interface Evento{
    title:string;
    description?:string;
    startDate: string;  
    status: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
    endDate: string;    
    isVirtual:boolean;
    meetingLink?:string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    category: 'academic' | 'work' | 'personal';
    recurrence?:any;
    externalSync?:any;
    userId:string;
    groupId?:string;
}
export  interface EventoUpdate{
    title?:string;
    description?:string;
    startDate?: string;  
    status?: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
    endDate?: string;    
    isVirtual?:boolean;
    meetingLink?:string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    category?: 'academic' | 'work' | 'personal';
    recurrence?:any;
    externalSync?:any;
    userId?:string;
    groupId?:string;
}