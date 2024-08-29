import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface EmailResponse {
  success: boolean;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.API_BASE_URL}/api/Notification/email`;  // Update this with your actual API URL

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, htmlMessage: string): Observable<EmailResponse> {
    const data = { to, subject, htmlMessage }
    return this.http.post<EmailResponse>(`${this.apiUrl}/send`, data);
  }
}
