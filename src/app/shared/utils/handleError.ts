import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // You can customize error handling here, like displaying a toast message
    // or logging errors to the console.
    console.error(errorMessage);
    return throwError(errorMessage);
}