import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { MediaType, Message, MessageMedia } from '../../../models/message.model';
import { Conversation } from '../../../models/conversation.model';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { IApiResponse } from '../../../models/api-response.models';
import { handleError } from '../../../shared/utils/handleError';
import { TokenService } from '../../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _apiUrl = `${environment.API_BASE_URL}/api/chat`;
  private _hubUrl = `${environment.API_BASE_URL}/hubs/chat`;
  private _connection!: HubConnection;
  private _token = inject(TokenService);

  constructor(private _http: HttpClient) {
    this._connection = new HubConnectionBuilder()
      .withUrl(this._hubUrl,{
        accessTokenFactory:()=>this._token.getToken()!
      })
      .withAutomaticReconnect()
      .build();
  }

  async startConnection(): Promise<void> {
    try {
      await this._connection.start();
      console.log('SignalR connection started');
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
    }
  }

  stopConnection(): Promise<void> {
    return this._connection.stop();
  }

  // Hub listeners
  errorListener(callback: (error: string) => void): void {
    this._connection.on('Error', callback);
  }

  messageReceivedListener(callback: (message: any) => void): void {
    this._connection.on('MessageReceived', callback);
  }

  messageUpdatedListener(callback: (message: Message) => void): void {
    this._connection.on('MessageUpdated', callback);
  }

  messageDeletedListener(callback: (messageId: string) => void): void {
    this._connection.on('MessageDeleted', callback);
  }

  conversationMarkedAsReadListener(callback: (conversationId: string) => void): void {
    this._connection.on('ConversationMarkedAsRead', callback);
  }

  userTypingListener(callback: (userId: string) => void): void {
    this._connection.on('UserTyping', callback);
  }

  mediaMessageReceivedListener(callback: (result: any) => void) {
    this._connection.on('MediaMessageReceived', callback);
  }
  
  mediaDeletedListener(callback: (mediaId: string) => void) {
    this._connection.on('MediaDeleted', callback);
  }

  // Hub invokers
  joinConversation(room: string): Promise<void> {
    return this._connection.invoke('JoinConversation', room);
  }

  async sendMessage(request: Message, files: File[]): Promise<void> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    
    files.forEach((file, index) => {
      formData.append(`mediaFiles`, file, file.name);
    });

    try {
      // First, upload the files
      const mediaUploadResponse = await this._http.post<IApiResponse<MessageMedia>>(`${this._apiUrl}/messages/upload-media`, formData).toPromise();
      
      // Then, add the uploaded media to the message
      request.media = mediaUploadResponse?.$values || [];
      
      // Finally, send the message through SignalR
      await this._connection.invoke('SendMessage', request);
    } catch (error) {
      console.error('Error sending message with media:', error);
      throw error;
    }
  }

  updateMessage(messageId: string, request: Message): Promise<void> {
    return this._connection.invoke('UpdateMessage', messageId, request);
  }

  deleteMessage(messageId: string): Promise<boolean> {
    return this._connection.invoke('DeleteMessage', messageId);
  }


  markConversationAsRead(conversationId: string): Promise<void> {
    return this._connection.invoke('MarkConversationAsRead', conversationId);
  }

  sendTypingNotification(room: string): Promise<void> {
    return this._connection.invoke('SendTypingNotification', room);
  }

  leaveConversation(room: string): Promise<void> {
    return this._connection.invoke('LeaveConversation', room);
  }

  // API methods
  createConversation(userId1: string, userId2: string): Observable<Conversation> {
    return this._http.post<Conversation>(`${this._apiUrl}/conversations`, { userId1, userId2 }).pipe(catchError(handleError));
  }

  blockUser(blockedId: string): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/users/${blockedId}/block`, {}).pipe(catchError(handleError));
  }

  unblockUser(unblockedId: string): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/users/${unblockedId}/unblock`, {}).pipe(catchError(handleError));
  }

  addMessageMedia(messageId: string, media: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/messages/${messageId}/media`, media).pipe(catchError(handleError));
  }

  deleteMessageMedia(messageId: string, mediaId: string): Observable<boolean> {
    return this._http.delete<boolean>(`${this._apiUrl}/messages/${messageId}/media/${mediaId}`).pipe(catchError(handleError));
  }

  getConversationById(conversationId: string): Observable<Conversation> {
    return this._http.get<Conversation>(`${this._apiUrl}/conversations/${conversationId}`).pipe(catchError(handleError));
  }

  getConversationByRoomId(roomId: string): Observable<Conversation> {
    return this._http.get<Conversation>(`${this._apiUrl}/conversations/room/${roomId}`).pipe(catchError(handleError));
  }

  getConversations(): Observable<IApiResponse<Conversation>> {
    return this._http.get<IApiResponse<Conversation>>(`${this._apiUrl}/conversations`).pipe(catchError(handleError));
  }

  getMessagesByConversationId(conversationId: string, page: number = 1, pageSize: number = 20):any {
    return this._http.get(`${this._apiUrl}/conversations/${conversationId}/messages`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    }).pipe(catchError(handleError));
  }

  getMessageById(messageId: string): Observable<Message> {
    return this._http.get<Message>(`${this._apiUrl}/messages/${messageId}`).pipe(catchError(handleError));
  }

  getUnreadConversationsCount(): Observable<number> {
    return this._http.get<number>(`${this._apiUrl}/unread-conversations-count`).pipe(catchError(handleError));
  }

  getLatestMessageByConversationId(conversationId: string): Observable<Message> {
    return this._http.get<Message>(`${this._apiUrl}/conversations/${conversationId}/latest-message`).pipe(catchError(handleError));
  }

  getUnreadMessagesCount(conversationId: string): Observable<number> {
    return this._http.get<number>(`${this._apiUrl}/conversations/${conversationId}/unread-count`).pipe(catchError(handleError));
  }

  getPaginatedMessages(conversationId: string, page: number = 1, pageSize: number = 20): Observable<any> {
    return this._http.get(`${this._apiUrl}/conversations/${conversationId}/messages/paginated`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    }).pipe(catchError(handleError));
  }

  getMediaByMessageId(messageId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this._apiUrl}/messages/${messageId}/media`).pipe(catchError(handleError));
  }

  getMediaByType(conversationId: string, mediaType: MediaType): Observable<any[]> {
    return this._http.get<any[]>(`${this._apiUrl}/conversations/${conversationId}/media/${mediaType}`).pipe(catchError(handleError));
  }

  isUserBlocked(otherUserId: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._apiUrl}/users/${otherUserId}/is-blocked`).pipe(catchError(handleError));
  }
}