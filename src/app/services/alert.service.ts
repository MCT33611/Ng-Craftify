import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';


type InputType = 'text' | 'textarea' | 'radio';

interface FormField {
  type: InputType;
  name: string;
  label: string;
  options?: string[]; // For radio and checkbox
  value?: string | boolean; // Default value
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

  // Method to show regular notification
  notification(title: string, message: string, icon: 'success' | 'error' | 'warning' = 'success') {
    Swal.fire({
      icon: icon,
      title: title,
      text: message
    });
  }

  // Method to show confirmation dialog centered on screen with red color
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

}
