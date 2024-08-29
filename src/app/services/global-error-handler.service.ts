import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  handleError(error: HttpErrorResponse | Error | ErrorHandler): void {
    console.error(error);
    
  }
  
}
