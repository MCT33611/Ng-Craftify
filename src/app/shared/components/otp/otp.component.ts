import { Component, ElementRef, QueryList, ViewChildren, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit, OnDestroy {
  countdown: number = 60;
  isCountdownActive = false;
  canResendOTP = false;
  isInValid = false;
  otpForm: FormGroup;
  @Input() email: string | null = null;
  @Output() otpVerified = new EventEmitter<boolean>();
  isEmailFromParams = false;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private destroy$ = new Subject<void>();
  private countdownInterval: number | undefined;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _alert: AlertService,
    private _loading: LoadingService
  ) {
    this.otpForm = this._fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
    });
    _loading.hide()
  }

  ngOnInit(): void {
    this.startCountdown();
    if (this.email) {
      this.sendOtp();
      this.isEmailFromParams = false;
    }
    else {
      this._route.paramMap.pipe(
        takeUntil(this.destroy$)
      ).subscribe(params => {
        this.email = params.get('email');
        if (this.email) {
          this.sendOtp();
          this.isEmailFromParams = true;
        } else {
          this._alert.error("OTP sender: email is undefined!");
          this._router.navigate(['/auth/sign-up']);
        }
      });
    }
  }

  sendOtp(): void {
    if (this.email) {
      this._auth.sentOtp(this.email).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        complete: () => this._alert.success("Please check your mailbox"),
        error: (error: HttpErrorResponse) => {
          this._alert.error(`${error.status}: ${error.error.title}`);
          this._router.navigate(['/auth/sign-up']);
        }
      });
    }
  }

  onInputChange(event: KeyboardEvent, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (!value && index > 0 && event.key === 'Backspace') {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
    this.isInValid = false;
  }

  onSubmit(): void {
    if (this.otpForm.valid && this.email) {
      const otp = Object.values(this.otpForm.value).join('');
      this._auth.confirmEmail(otp, this.email).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next:(res)=>console.log(res),
        complete: () => {
          if (this.isEmailFromParams)
            this._router.navigate(['/auth/sign-in']);
          else
            this.otpVerified.emit(true);
        },
        error: (error: HttpErrorResponse) => {
          this.otpVerified.emit(false);
          this._alert.error(`${error.status}: ${error.error.title}`)
        }
      });
    }
  }

  startCountdown(): void {
    this.countdown = 60;
    this.isCountdownActive = true;
    this.canResendOTP = false;

    this.clearCountdownInterval();
    this.countdownInterval = window.setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearCountdownInterval();
        this.isCountdownActive = false;
        this.canResendOTP = true;
      }
    }, 1000);
  }

  clearCountdownInterval(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  resendOTP(): void {
    if (this.canResendOTP) {
      this.startCountdown();
      this.sendOtp();
    }
  }

  containsCharacters(otpValue: string): boolean {
    const characterRegex = /[a-zA-Z]/;
    return characterRegex.test(otpValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearCountdownInterval();
  }
}