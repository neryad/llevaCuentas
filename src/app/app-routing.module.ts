import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'form-account',
    loadChildren: () =>
      import('./form-account/form-account.module').then(
        (m) => m.FormAccountPageModule
      ),
  },
  {
    path: 'form-user',
    loadChildren: () =>
      import('./form-user/form-user.module').then((m) => m.FormUserPageModule),
  },
  {
    path: 'amount-form',
    loadChildren: () =>
      import('./amount-form/amount-form.module').then(
        (m) => m.AmountFormPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
