import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormUserPage } from './form-user.page';

const routes: Routes = [
  {
    path: ':id',
    component: FormUserPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormUserPageRoutingModule {}
