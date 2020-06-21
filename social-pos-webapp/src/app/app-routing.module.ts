import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';


import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/account/signin']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
  {path:'',redirectTo:'/app',pathMatch:'full'},
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [ 
      {
        path: '',
        component: DashboardComponent
      },
      {
        path:'account',
        loadChildren: () => import('./modules/accounts/accounts.module').then(m => m.AccountsModule)
      },    
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]    
  },
  { 
    path: 'account', 
    loadChildren: () => import('./modules/accounts/accounts.module').then(m => m.AccountsModule) 
  },
  { 
    path:'**',redirectTo:'/app' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
