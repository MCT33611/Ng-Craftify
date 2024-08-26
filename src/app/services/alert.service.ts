import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { NotificationType,Notification } from '../models/notification.models';

type InputType = 'text' | 'textarea' | 'radio';

interface FormField {
  type: InputType;
  name: string;
  label: string;
  options?: string[]; 
  value?: string | boolean; 
}


@Injectable({
  providedIn: 'root'
})
export class AlertService {



  // Method to show success toast
  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000 // 3 seconds
    });
  }

  // Method to show error toast
  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000 // 3 seconds
    });
  }

  // Method to show warning toast
  warning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000 // 3 seconds
    });
  }

  notification(notification: Notification) {
    const icon = this.getIconForNotificationType(notification.type);

    Swal.fire({
      icon: icon,
      title: notification.subject,
      text: notification.content,
      footer: `From: ${notification.senderId} | ${notification.timestamp.toLocaleString()}`,
      position: 'bottom-end',
      timer: 3000, // Timeout set to 3 seconds (3000 milliseconds)
      timerProgressBar: true, // Shows a progress bar
      toast: true, // Enables the toast style
      showConfirmButton: false, // Hides the confirm button
    });
    

    notification.isRead = true;
  }

  async confirm(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      timerProgressBar: true, // Add timer progress bar for visual indication
    }).then((result) => result.isConfirmed);
  }

  private getIconForNotificationType(type: NotificationType): 'success' | 'info' | 'warning' | 'error' {
    switch (type) {
      case NotificationType.Message:
        return 'info';
      case NotificationType.SystemAlert:
        return 'warning';
      default:
        return 'info';
    }
  }
}
