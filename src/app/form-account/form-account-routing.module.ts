import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAccountPage } from './form-account.page';

const routes: Routes = [
  {
    path: '',
    component: FormAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAccountPageRoutingModule {}
