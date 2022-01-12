export class Message {
    public id?: string;
    public text?: string;
    public createdAt: Date = new Date();
    public chatId: string = "";
    public userName?: string;
    public userEmail?: string;
    public isRead?: boolean;
}