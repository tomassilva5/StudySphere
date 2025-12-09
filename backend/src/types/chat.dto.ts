export default interface Chat{
    name:string;
    membersId:string[];
    type:'group';
}

export default interface Message{
    userid:string
    content:string
    chatid:string
    file:string
}