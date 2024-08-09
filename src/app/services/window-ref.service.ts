import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor(private _router: Router) { }

  get nativeWindow(): any  {
    return getWindow();
  }

  reload() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/empty', { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(currentUrl);
    });
  }
}

function getWindow(): Window  {
  return window;
}
