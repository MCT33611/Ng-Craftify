import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { IPlan } from '../../../../models/iplan';
import { RazorpayService } from '../../../../services/razorpay.service';
import { AlertService } from '../../../../services/alert.service';
import { WindowRefService } from '../../../../services/window-ref.service';
import { IUser } from '../../../../models/iuser';
import { ISubscription } from '../../../../models/isubscription';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { AuthService } from '../../../authentication/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrl: './upgrade.component.css'
})
export class UpgradeComponent implements OnInit {

  profileService = inject(ProfileService);
  authService = inject(AuthService);
  razorpay = inject(RazorpayService);
  alert = inject(AlertService);
  winRef = inject(WindowRefService);
  announcer = inject(LiveAnnouncer);
  fb = inject(FormBuilder);
  router = inject(Router);
  plans: IPlan[] = [];
  globelSubscription!: ISubscription;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills?: Observable<string[]>;
  skills: string[] = [];
  allSkills: string[] = [];
  ServiceOptions: string[] = [];
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;
  subscriptionForm: FormGroup;
  showPlans: boolean = false;
  skillsInputCrl : FormControl;
  
  constructor() {
    this.subscriptionForm = this.fb.group({
      perHourPrice: ['', [Validators.required, Validators.min(0)]],
      serviceTitle: ['', Validators.required],
      skills: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.skillsInputCrl = this.subscriptionForm.get('skillCtrl') as FormControl;
  }
  ngOnInit(): void {
    this.profileService.getAllPlans().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.$values)) {
          this.plans = res.$values;
        } else if (Array.isArray(res)) {
          this.plans = res;
        } else {
          console.error('Unexpected response format:', res);
          this.plans = []; 
        }
        console.log('Plans:', this.plans); 
      },
      error: (err) => {
        console.error('Error fetching plans:', err);
        this.plans = []; 
      }
    });

    this.filteredSkills = this.subscriptionForm.get('skillCtrl')?.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => (skill ? this.skills_filter(skill) : this.allSkills.slice())),
    );
  }


  buy(planId: string | null | undefined) {
    if (this.subscriptionForm.invalid) {
      this.alert.warning("Please fill the below inputs before payment");
      return;
    }
    if (planId) {
      this.profileService.get().subscribe({
        next: (user: IUser) => {
          this.razorpay.pay(
            planId,
            this.onSuccess,
            () => { this.alert.error("Payment failed") },
            {
              email: user.email,
              name: user.firstName,
              phone: user.role
            }
          );
        }
      });
    } else {
      this.alert.error("Id is " + planId);
    }
  }

  onSuccess = async (getSubscription: { paymentId: string, userId: string, planId: string }) => {
    const formValues = this.subscriptionForm.value;
    const subscription: ISubscription = {
      ...this.globelSubscription,
      ...getSubscription,
      ...formValues,
      perHourPrice: +formValues.perHourPrice, // Ensure perHourPrice is a number
      skills: formValues.skills // Assuming skills are already in the desired format
    };
    console.log(subscription);

    this.profileService.Subscribe(subscription).subscribe({
      complete: () => {
        this.alert.success("Payment successfully completed");
        this.alert.warning("Please login again");
        this.authService.logout();
        this.router.navigate(['/auth/sign-in']);
      },
      error: (err) => {
        this.alert.error(`${err.error}, ${err.status}`)
        console.log(err);
        
      }
    });
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if(value.includes(','))
        this.skills.push(...value.split(','))
      else
        this.skills.push(value);
    
    }
    event.chipInput!.clear();
    this.subscriptionForm.get('skillCtrl')?.setValue(null);
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
      this.announcer.announce(`Removed ${skill}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.subscriptionForm.get('skillCtrl')!.setValue(null);
  }

  onFileSelected(files: File[]) {
    if (files && files.length > 0) {
      const file: File = files[0];
      if (file) {
        this.profileService.uploadWorkerDoc(file).subscribe({
          next: (res: { docUrl: string }) => {
            this.globelSubscription = { ...this.globelSubscription, certificationUrl: res.docUrl };
            this.alert.success("Documents uploaded");
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            this.alert.error(`${err.error}: ${err.status}`);
          }
        });
      }
    }
  }
  onContinue() {
    if (this.subscriptionForm.valid) {
      this.showPlans = true;
    }
  }

  goBack() {
    this.showPlans = false;
  }

  private skills_filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSkills.filter(skill => skill.toLowerCase().includes(filterValue));
  }


}
