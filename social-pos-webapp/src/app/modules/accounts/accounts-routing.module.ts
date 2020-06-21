import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './profile/profile.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/account/signin']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
  {
    path:'',
    component:ProfileComponent,
    canActivate: [AngularFireAuthGuard],  
    data: { authGuardPipe: redirectUnauthorizedToLogin}
  },
  { path:'signup',
    component:SignupComponent,
    canActivate: [AngularFireAuthGuard],  
    data: { authGuardPipe: redirectLoggedInToItems}
  },
  {
    path:'signin',
    component:SigninComponent,
    canActivate: [AngularFireAuthGuard],  
    data: { authGuardPipe: redirectLoggedInToItems}
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate: [AngularFireAuthGuard],  
    data: { authGuardPipe: redirectUnauthorizedToLogin}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
