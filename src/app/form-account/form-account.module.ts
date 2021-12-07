import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAccountPageRoutingModule } from './form-account-routing.module';

import { FormAccountPage } from './form-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAccountPageRoutingModule
  ],
  declarations: [FormAccountPage]
})
export class FormAccountPageModule {}
