import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  handleError(error: any): void {
    console.error('An unhandled error occurred:', error);
  }
}
