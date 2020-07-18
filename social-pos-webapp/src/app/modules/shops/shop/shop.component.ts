import { Component, OnInit } from '@angular/core';
import { ShopsService } from 'src/app/services/shops.service';
import { UShopsJoin } from 'src/app/entities/shops-join';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UShops } from 'src/app/entities/shops';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  
  public loading:boolean;
  public uShopsJoin: Observable<UShopsJoin[]>;
  public uShops: Observable<UShops[]>;
  public isShopsJoin:boolean;  
  public uid:string;

  constructor(private shopService:ShopsService,private auth:AngularFireAuth) { }

  getShop(shopId:string)
  {
    this.uShops = this.shopService.getShop(shopId);
  }

  joinShop(shopId:string)
  {
    this.shopService.joinShop(shopId,this.uid);    
  }

  ngOnInit(): void {
    this.auth.authState.subscribe(user =>{
      this.uid = user.uid;
      this.uShopsJoin = this.shopService.getJoinShop(this.uid);
      this.uShopsJoin.subscribe(shopsJoin =>{
        let shop = shopsJoin.find(f => f.allow);
        if(shop == null)
        { 
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
