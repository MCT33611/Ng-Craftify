import { Component, OnDestroy, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { ProfileStore } from '../../../../shared/store/profile.store';
import { IUser } from '../../../../models/iuser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { getMonthAndDate } from '../../../../shared/utils/getMonthAndDate';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnDestroy {
  profile = inject(ProfileService);
  router = inject(Router);
  alert = inject(AlertService);
  profileStore = inject(ProfileStore);
  fb = inject(FormBuilder);

  user!: IUser;
  profileForm!: FormGroup;
  profileSubscription!: Subscription; // Store the profile subscription

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      postalCode: [''],
      state: [''],
      city: [''],
    });
    this.profileStore.loadAll();
  }

  ngOnInit(): void {
    if (this.profile) {
      this.profileSubscription = this.profile.get().subscribe({
        next: (res: IUser) => {
          this.user = res;
          if (this.user.updatedDate) {
            this.initializeForm();
          }
        },
        error: (error: HttpErrorResponse) => {
          // Handle profile retrieval error here (optional)
          console.error('Error retrieving profile:', error);
        },
      });
    }
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName],
      postalCode: [this.user.postalCode],
      state: [this.user.state],
      city: [this.user.city],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUserData: IUser = this.profileForm.value;

      this.profile.update(updatedUserData).subscribe({
        complete: () => {
          this.profileStore.loadAll();
          this.alert.success('Profile updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.alert.error(`${error.status} : ${error.message}`);
        },
      });
    } else {
      this.alert.error('Invalid form data');
    }
  }

  fileUploadSeccessHandler(cdnUrl : string){
    const user: IUser = {
      profilePicture: cdnUrl ?? ''
    };
    this.profile.update(user).subscribe({
      complete: () => {
        this.alert.success("Profile picture updated successfully");
        this.profileStore.loadAll();
      },
      error: (error: HttpErrorResponse) => this.alert.error(`${error.status} : ${error.error[0].title}`)
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

}