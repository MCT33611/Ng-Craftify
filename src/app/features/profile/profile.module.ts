import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SecurityComponent } from './components/security/security.component';
import { RouterOutlet } from '@angular/router';
import { PasswordResetFormComponent } from '../../shared/components/password-reset-form/password-reset-form.component';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UploaderComponent } from '../../shared/components/uploader/uploader.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { UiUpsertFormComponent } from '../../shared/components/ui-upsert-form/ui-upsert-form.component';
import { FileDropComponent } from '../../shared/components/file-drop/file-drop.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    EditProfileComponent,
    SecurityComponent,
    UpgradeComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterOutlet,
    PasswordResetFormComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    UploaderComponent,
    CurrencyPipe,
    DatePipe,
    AsyncPipe,
    UiUpsertFormComponent,
    FileDropComponent,
    IonicModule
  ],
})
export class ProfileModule { }
