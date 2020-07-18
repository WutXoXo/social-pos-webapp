import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { CrudShopComponent } from './crud-shop/crud-shop.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/account/signin']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
  {
  path:'',
  component:ShopComponent,
  canActivate: [AngularFireAuthGuard],  
  data: { authGuardPipe: redirectUnauthorizedToLogin}
  },
  { path:'create',
      component:CrudShopComponent,
      canActivate: [AngularFireAuthGuard],  
      data: { authGuardPipe: redirectUnauthorizedToLogin}
  },
  { path:':id/modify',
      component:CrudShopComponent,
      canActivate: [AngularFireAuthGuard],  
      data: { authGuardPipe: redirectUnauthorizedToLogin}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopsRoutingModule { }
