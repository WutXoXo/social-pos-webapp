import { HammerModule  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';

import { NgxLoadingModule } from 'ngx-loading';
import { ImageCropperModule } from 'ngx-image-cropper';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import {environment} from '../../../environments/environment';

import { ShopsRoutingModule } from './shops-routing.module';
import { ShopComponent } from './shop/shop.component';
import { CrudShopComponent } from './crud-shop/crud-shop.component';





@NgModule({
  declarations: [ShopComponent, CrudShopComponent],
  imports: [
    HammerModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule,
    AutocompleteLibModule,
    ShopsRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class ShopsModule { }
