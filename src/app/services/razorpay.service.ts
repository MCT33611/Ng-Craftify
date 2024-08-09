import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, map } from 'rxjs';
import { handleError } from '../shared/utils/handleError';
import { TokenService } from './token.service';
import { IPlan } from '../models/iplan';
import { PaymentInitResponse } from '../models/payment-init-response';


@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  
  constructor(
    private _http: HttpClient,
    private _winRef: WindowRefService,
    private _tokenService : TokenService
  ) { }

  private async getOrderId(userId: string, planId: string): Promise<string> {
    return await lastValueFrom(
      this._http.get(`${environment.API_BASE_URL}/api/Profile/Payment/Init?userId=${userId}&planId=${planId}`, { responseType: 'text' }).pipe(
        catchError(handleError)
      )
    );
  }

  private getPlan(PlanId: string) {
    return this._http.get<IPlan>(`${environment.API_BASE_URL}/api/Plan/${PlanId}`);

  }


  async pay(
    PlanId: string,
    success: (Subscription: { paymentId: string, userId: string, planId: string }) => void,
    failed: () => void,
    prefill?: {
      name?: string; email?: string; phone?: string | null

    }) {
    let plan!: IPlan;
    let orderId: string  = "";
    const userId = this._tokenService.getUserId()
    try {
      this.getPlan(PlanId).subscribe(res=>plan = res);

      
      if (userId) {
        orderId = await this.getOrderId(userId, PlanId);
        console.log("orderId:", orderId);
      }
      
    } catch (error) {
      console.error('Error fetching plan or order ID:', error);
      failed();
      return;
    }
    let razorpayOptions;
    if(plan){

      razorpayOptions = {
        currency: 'INR',
        name: 'Craftity',
        description: 'Subscription Plan',
        amount: (plan.price ?? 0)* 100,
        key: environment.RazorpaySettings.KeyId,
        image: '_https://res.cloudinary.com/dhsvbucth/image/upload/c_crop,h_250,w_250/Screenshot_2024-05-29_110142_rjbfwv.jpg',
        order_id: JSON.parse(orderId)?.orderId,
        prefill,
        theme: {
          color: '#6466e3'
        },
        modal: {
          escape: false,
          ondismiss: () => {
            console.log('dismissed');
            failed(); // Consider handling dismissal as failed payment
          }
        },
        handler: (response:{razorpay_payment_id : string}) => {
          if (response.razorpay_payment_id) {
            success({paymentId:response.razorpay_payment_id,userId: userId!,planId: PlanId});
          } else {
            failed();
          }
        }
      };
    }
    console.log(razorpayOptions);
    
    const rzp = new this._winRef.nativeWindow.Razorpay(razorpayOptions);
    rzp.open();
  }
}
