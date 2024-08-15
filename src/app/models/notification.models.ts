export interface Notification {
    id: number;
    subject: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    userId: string;
    senderId: string;
    type: NotificationType;
}

export enum NotificationType {
    Message,
    SystemAlert,
}
