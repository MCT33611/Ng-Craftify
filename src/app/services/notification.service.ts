import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.models';
import { TokenService } from './token.service';
import { IApiResponse } from '../models/api-response.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private hubConnection!: HubConnection;
  private notificationSubject = new BehaviorSubject<Notification[]>([]);
  private currentUserId ;
  
  constructor(private http: HttpClient,private tokenService:TokenService) {
    this.currentUserId = tokenService.getUserId();
    this.createHubConnection();
  }

  private createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_URL}/hubs/notification`,{
        accessTokenFactory:()=>this.tokenService.getToken()!
      })
      .build();

    this.hubConnection.start().catch(err => console.error(err));
    console.log('SignalR connection started : notification');
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('ReceiveNotification');
      
      const currentNotifications = this.notificationSubject.value;
      this.notificationSubject.next([...currentNotifications, notification]);
    });
  }

  joinUserGroup(userId = this.currentUserId) {
    this.hubConnection.invoke('JoinUserGroup', userId);
  }

  getUnreadNotifications(userId = this.currentUserId):Observable<IApiResponse<Notification>>{
    return this.http.get<IApiResponse<Notification>>(`${environment.API_BASE_URL}/api/notification/unread/${userId}`);
  }

  markAsRead(notificationId: number):Observable<Object>{
    return this.http.post(`${environment.API_BASE_URL}/api/notification/markAsRead/${notificationId}`, {});
  }

  getNotifications():Observable<Notification[]>{
    return this.notificationSubject.asObservable();
  }
}
