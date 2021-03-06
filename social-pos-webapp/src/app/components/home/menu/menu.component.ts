import { Component, OnInit } from '@angular/core';
import { ShopsService } from 'src/app/services/shops.service';
import { UShopsJoin } from 'src/app/entities/shops-join';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UShops } from 'src/app/entities/shops';

declare const App : any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public uShopsJoin: Observable<UShopsJoin[]>;
  public uShops: Observable<UShops[]>;  
  public isShopsJoin:boolean;
  private uid:string;


  constructor(private shopService:ShopsService,private auth:AngularFireAuth) { }

  getShop(shopId:string)
  {
    this.uShops = this.shopService.getShop(shopId);
  }

  ngOnInit(): void {
    App.initMainPage();
    this.auth.authState.subscribe(user =>{
      this.uid = user.uid;
      this.uShopsJoin = this.shopService.getJoinShop(this.uid);
      this.uShopsJoin.subscribe(shopsJoin =>{
         let shop = shopsJoin.find(f => f.allow);
         if(shop == null){ 
          this.isShopsJoin = true; 
          this.getShop("");         
         }
        else{
          this.isShopsJoin = false;
          this.getShop(shop.shopId);
        }
      });      
    });    
  }

}
