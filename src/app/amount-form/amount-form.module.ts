import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmountFormPageRoutingModule } from './amount-form-routing.module';

import { AmountFormPage } from './amount-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmountFormPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AmountFormPage],
})
export class AmountFormPageModule {}
