import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmountFormPage } from './amount-form.page';

const routes: Routes = [
  {
    path: ':id',
    component: AmountFormPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmountFormPageRoutingModule {}
