import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AlertService } from '../../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { TokenService } from '../../../../services/token.service';
import { ProfileStore } from '../../../../shared/store/profile.store';
import { IRoles } from '../../../../core/constants/roles';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'] // fixed typo styleUrl -> styleUrls
})
export class SecurityComponent implements OnInit, OnDestroy {

  profile = inject(ProfileService);
  profileStore = inject(ProfileStore);
  alert = inject(AlertService);
  router = inject(Router);
  authService = inject(AuthService);
  tokenService = inject(TokenService);

  isEmailValid = false;
  email!: string | null;
  adminRole = IRoles.Role_Admin;
  private subscriptions: Subscription = new Subscription(); // Subscription object to manage subscriptions

  ngOnInit(): void {
    this.email = this.tokenService.getUserEmail();
    if (this.email) {
      const sub = this.authService.forgetPassword(this.email).subscribe({
        complete: () => {
          this.isEmailValid = true;
        },
        error: (error) => this.alert.error(`${error.status} : ${error.error[0].description}`)
      });
      this.subscriptions.add(sub); 
    } else {
      this.alert.error("password reset init : email is undefined !!");
    }
  }

  async delete() {
    if (await this.alert.confirm("Are You Sure", "Do you want to delete this account?")) {
      const sub = this.profile.delete(this.tokenService.getUserId() ?? 'null').subscribe({
        complete: () => {
          this.alert.success("User deleted successfully");
          this.authService.logout();
          this.router.navigate(['/auth/sign-in']);
        }
      });
      this.subscriptions.add(sub); 
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); 
  }
}
