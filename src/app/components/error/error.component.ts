import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone:true,
  imports:[RouterLink],
  template: `
    <div
      class="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Oops! An error occurred
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ errorMessage }}
          </p>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Error Details
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div
                class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Status Code</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ statusCode }}
                </dd>
              </div>
              <div
                class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Error Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ errorType }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="text-center">
          <a [routerLink]="retrunTo" class="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ErrorComponent implements OnInit {
  statusCode: string = '';
  errorMessage: string = '';
  errorType: string = '';
  retrunTo:string = '/';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
        this.retrunTo = params['retrunTo'] || '/'
      this.statusCode = params['statusCode'] || 'Unknown';
      this.errorMessage = params['message'] || 'An unexpected error occurred';
      this.errorType = params['type'] || 'General Error';
    });
  }
}
