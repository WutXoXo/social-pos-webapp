import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


const routes: Routes = [
  {path:'',redirectTo:'/app',pathMatch:'full'},
  {
    path: 'app',
    component: HomeComponent,
    children: [ 
      {
        path: '',
        component: DashboardComponent
      },    
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]    
  },
  {path:'login',component:LoginComponent},
  {path:'**',redirectTo:'/add'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
