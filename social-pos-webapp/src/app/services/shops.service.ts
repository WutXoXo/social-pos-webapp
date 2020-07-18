import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { UShopsJoin } from '../entities/shops-join';
import { Observable } from 'rxjs';
import { UShops } from '../entities/shops';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private firestore: AngularFirestore ) { 
    
  }

  setShop(
    shopName:string,
    photoURL:string,
    ownerId:string,
    firstName: string,
    lastName: string,
    phoneNumber:string,
    email:string,
    address:string,
    districtId: number,
    districtName: string,
    borderId: number,
    borderName: string,
    provinceId: number,
    provinceName: string,
    postCode: string,
    isVat: boolean,
    typeVat: number,
    uid:string)
  {
    let shopId = this.firestore.createId();
    this.firestore.collection<UShops>("u_shops").add({
        shopId:shopId,
        shopName:shopName,
        photoURL:photoURL,
        ownerId:ownerId,
        firstName: firstName,
        lastName: lastName,
        phoneNumber:phoneNumber,
        email:email,
        address:address,   
        districtId: districtId,
        districtName: districtName,
        borderId: borderId,
        borderName: borderName,
        provinceId: provinceId,
        provinceName: provinceName,
        postCode: postCode,
        isVat: isVat,
        typeVat: typeVat,
        isActive:true,
        createdBy:uid,
        createdAt:new Date(),
        updatedBy:uid,
        updatedAt:new Date() 
    });
    
    return this.firestore.collection<UShopsJoin>('u_shops_join').add({
      shopId:shopId,
      uid:uid,
      joinId:this.firestore.createId(),
      allow:true,
      isActive:true,
      createdBy:uid,
      createdAt:new Date(),
      updatedBy:uid,
      updatedAt:new Date()
    });
  }

  editShop(
    id:string,
    shopId:string,
    shopName:string,
    photoURL:string,
    ownerId:string,
    firstName: string,
    lastName: string,
    phoneNumber:string,
    email:string,
    address:string,
    districtId: number,
    districtName: string,
    borderId: number,
    borderName: string,
    provinceId: number,
    provinceName: string,
    postCode: string,
    isVat: boolean,
    typeVat: number,
    lastDate:Date,
    lastUid:string,
    uid:string)
  {
    return this.firestore.collection<UShops>("u_shops").doc(id)
        .set({
          shopId:shopId,
          shopName:shopName,
          photoURL:photoURL,
          ownerId:ownerId,
          firstName: firstName,
          lastName: lastName,
          phoneNumber:phoneNumber,
          email:email,
          address:address,   
          districtId: districtId,
          districtName: districtName,
          borderId: borderId,
          borderName: borderName,
          provinceId: provinceId,
          provinceName: provinceName,
          postCode: postCode,
          isVat: isVat,
          typeVat: typeVat,
          isActive:true,
          createdBy:lastUid,
          createdAt:lastDate,
          updatedBy:uid,
          updatedAt:new Date() 
      });
  }

  getJoinShop(uid:string) : Observable<UShopsJoin[]>
  {
    return this.firestore.collection<UShopsJoin>('u_shops_join',ref => ref.where("uid","==",uid)).valueChanges();
  }

  getShop(shopId:string) : Observable<UShops[]>
  {
    return this.firestore.collection<UShops>('u_shops',ref => ref.where("shopId","==",shopId)).valueChanges();
  }

  getInfo(shopId:string)
  {
    return this.firestore.collection('u_shops',ref => ref.where("shopId","==",shopId)).snapshotChanges();
  }


  joinShop(shopId:string,uid:string)
  {
    return this.firestore.collection<UShopsJoin>('u_shops_join').add({shopId:shopId,uid:uid,joinId:this.firestore.createId(),allow:false,isActive:true,createdBy:uid,createdAt:new Date(),updatedBy:uid,updatedAt:new Date()});
  }

}
 