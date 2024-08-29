import { HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

// export function  handleError(error: HttpErrorResponse) {
//     let errorMessage = 'An error occurred';
//     if (error.error instanceof ErrorEvent) {
//         // Client-side error
//         errorMessage = `Error: ${error.error.message}`;
//     } else {
//         // Server-side error
//         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     // You can customize error handling here, like displaying a toast message
//     // or logging errors to the console.
//     console.error(errorMessage);
//     return throwError(errorMessage);
// }

export function handleError(error: HttpErrorResponse) {
  const router = inject(Router);
  const ngZone = inject(NgZone);
  const route = inject(ActivatedRoute);

  console.error('An error occurred:', error);

  let statusCode = '500';
  let errorMessage = 'An unexpected error occurred';
  let errorType = 'Unknown Error';
  let retrunTo = '/';

  if (error instanceof HttpErrorResponse) {
    statusCode = error.status.toString();
    errorMessage = error.error.message || error.message;
    errorType = 'HTTP Error';
  }
  retrunTo = route.snapshot.url.join('/');

  ngZone.run(() => {
    router.navigate(['/error'], {
      queryParams: {
        retrunTo: retrunTo,
        statusCode: statusCode,
        message: errorMessage,
        type: errorType,
      },
    });
  });
  return throwError(errorMessage);
}
