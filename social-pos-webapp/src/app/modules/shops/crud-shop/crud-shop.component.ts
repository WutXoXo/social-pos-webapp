import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';

import { Observable, Observer } from "rxjs";
import { finalize, tap } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import { ThaiAddressService } from '../../../services/thai-address.service';
import { ThaiAddress } from 'src/app/models/thai-address';
import { ShopsService } from 'src/app/services/shops.service';
import { UShops } from 'src/app/entities/shops';



@Component({
  selector: 'app-crud-shop',
  templateUrl: './crud-shop.component.html',
  styleUrls: ['./crud-shop.component.scss']
})
export class CrudShopComponent implements OnInit {
  
  public id: string;
  public mode:boolean;
  public loading:boolean;
  public croppedImage: any = 'assets/100x100.png';
  public imageFileBase64:string|null;
  public imageFile:File|null;
  public imageFile2KB:File|null;
  public imageChangedEvent: any = '';
  public photoURLActivity = "btn-default";  

  public isShowCrop:boolean = false;
  public keyword:string = "text";
  public task: AngularFireUploadTask;
  public percentage: Observable<number>;
  public snapshot: Observable<any>;
  public uShops: UShops[];
  public downloadURL: string|null;

  public docId: string;
  public shopId: string;
  public uid: string;
  public shopName: string;
  public isVat: boolean = false;
  public typeVat: number = 1;
  public firstName: string = "";
  public lastName: string= "";
  public phoneNumber:string= "";
  public email:string= "";
  public address:string= "";
  public district:string= "";
  public border:string= "";
  public province:string= "";
  public postCode:string= "";
  public lastDate:Date;
  public lastUid:string;
  public dataAddress:Array<ThaiAddress>;
  public selectAddress:ThaiAddress;

  public data:Array<ThaiAddress>;
  public errorMsg: string;
  public isLoadingResult: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afAuth:AngularFireAuth,
    private ng2ImgMax: Ng2ImgMaxService,
    private afStorage: AngularFireStorage,
    private thaiAddress:ThaiAddressService,
    private shopService:ShopsService) { }

  fileChangeEvent(event: any): void {    
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.isShowCrop = true;
    }
    else
    {
      this.isShowCrop = false;
      this.croppedImage = 'assets/100x100.png';
      this.photoURLActivity = "btn-default";  
    }       
  }
  
  imageCropped(event: ImageCroppedEvent) {    
      this.croppedImage = event.base64;
      if(event.base64 != null) this.imageFileBase64 = event.base64.replace(/^data:image\/(png|jpg);base64,/, "");
      this.createBlobImageFile();      
  }

  selectEvent(item:ThaiAddress) {
    this.selectAddress = item;
    this.district = item.district_name;
    this.border = item.border_name;
    this.province = item.province_name;
    this.postCode = item.district_code;
  }

  getServerResponse(e) {
    this.isLoadingResult = true;
    let resultData = this.dataAddress.filter(o => o.text !=null && o.text.search(new RegExp(e,"gi")) != -1);
    if (resultData == undefined || resultData == null) {
      this.data = [];
      this.errorMsg = "notFound";
    } else {
      this.data = resultData;
    }
    this.isLoadingResult = false;
  }

  searchCleared() {
    this.isLoadingResult = true;
    this.data = this.dataAddress.filter(o => o.province_id == 111);
    this.isLoadingResult = false;
    this.selectAddress = null;
    this.district = null;
    this.border = null;
    this.province = null;
    this.postCode = null;
  }

  createBlobImageFile(): void {
    this.dataURItoBlob(this.imageFileBase64).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName: string = this.generateName();
      this.imageFile = new File([imageBlob], imageName, {
        type: "image/jpeg"
      });
      if(this.imageFile.size >2560)
      {
         this.resizeImageFile();
      }
      else
      {
        this.imageFile2KB = this.imageFile;
        this.photoURLActivity = "btn-success";       
      } 
    });
  }

  dataURItoBlob(dataURI: string | null): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }
  
  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = "";
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return Guid.create().toString()+"-"+ date + "-" + text + ".jpeg";
  }

  resizeImageFile():void{
    this.ng2ImgMax.compressImage(this.imageFile, 0.0025).subscribe(
      result => {
        this.imageFile2KB = new File([result], this.imageFile.name);
        this.photoURLActivity = "btn-success";   
      },
      error => {
        console.error( error);
      }
    );
  }

  storageUpload():void{
    this.loading = true;
    const path = `shop/${this.imageFile2KB.name}`;
    const ref = this.afStorage.ref(path);
    this.task = this.afStorage.upload(path, this.imageFile2KB);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.loading = false;
        this.isShowCrop = false;    
        this.imageFile2KB = null;
        this.photoURLActivity = "btn-default";
      })
    );

    this.snapshot.subscribe(url => {
      if (url) {
        console.log(url);
      }
    },
    error =>{
        this.loading = false;
        console.error(error);
    });
  }

  submitShop(f: NgForm):void
  {
    if(f.valid)
    {
      this.loading = true;  
      if(this.selectAddress == null && this.uShops != null && this.uShops[0].provinceId != null) 
      {
        this.selectAddress = this.dataAddress.find(o => o.district_id == this.uShops[0].districtId);
      //  let d = this.dataAddress.filter(o => o.province_id == this.uShops[0].provinceId && o.border_id == this.uShops[0].borderId && o.district_id == this.uShops[0].districtId);
      //  if(d != null && d.length > 0) this.selectAddress = d[0];
      } 

      if(this.selectAddress != null){
        if(this.mode){
          this.shopService.setShop(
            this.shopName,
            this.downloadURL,
            this.uid,
            this.firstName,
            this.lastName,
            this.phoneNumber,
            this.email,
            this.address,
            this.selectAddress.district_id,
            this.selectAddress.district_name,
            this.selectAddress.border_id,
            this.selectAddress.border_name,
            this.selectAddress.province_id,
            this.selectAddress.province_name,
            this.selectAddress.district_code,
            this.isVat,
            this.typeVat,
            this.uid).then(res => {
              this.loading = false;
              this.router.navigate(["/app/shop"]);          
            });
        }
        else
        {
          this.shopService.editShop(
            this.docId,
            this.shopId,
            this.shopName,
            this.downloadURL,
            this.uid,
            this.firstName,
            this.lastName,
            this.phoneNumber,
            this.email,
            this.address,
            this.selectAddress.district_id,
            this.selectAddress.district_name,
            this.selectAddress.border_id,
            this.selectAddress.border_name,
            this.selectAddress.province_id,
            this.selectAddress.province_name,
            this.selectAddress.district_code,
            this.isVat,
            this.typeVat,
            this.lastDate,
            this.lastUid,            
            this.uid).then(res => {
              this.loading = false;
              this.router.navigate(["/app/shop"]);          
            });
        }
      }
      else{
        if(this.mode){
          this.shopService.setShop(
            this.shopName,
            this.downloadURL,
            this.uid,
            this.firstName,
            this.lastName,
            this.phoneNumber,
            this.email,
            this.address,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            this.isVat,
            this.typeVat,
            this.uid).then(res => {
              this.loading = false;
              this.router.navigate(["/app/shop"]);          
            });
        }
        else
        {
          this.shopService.editShop(
            this.docId,
            this.shopId,
            this.shopName,
            this.downloadURL,
            this.uid,
            this.firstName,
            this.lastName,
            this.phoneNumber,
            this.email,
            this.address,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            this.isVat,
            this.typeVat,
            this.lastDate,
            this.lastUid, 
            this.uid).then(res => {
              this.loading = false;
              this.router.navigate(["/app/shop"]);          
            });
        }
      }
    }
  }

  getShop(shopId:string)
  {
    var shop = this.shopService.getInfo(shopId);
    shop.subscribe(res =>{
      this.uShops = res.map(item =>{
        var d = item.payload.doc.data() as UShops;
        d.id = item.payload.doc.id;
        return d;
      });

       if(res != null && res.length > 0)
       {
         this.docId = this.uShops[0].id;
         this.shopId = this.uShops[0].shopId;
         this.lastDate = this.uShops[0].createdAt;
         this.lastUid = this.uShops[0].createdBy;
         if(this.uShops[0].photoURL != null && this.uShops[0].photoURL !="")
         { 
           this.croppedImage = this.uShops[0].photoURL;
           this.downloadURL= this.uShops[0].photoURL;
         }
         if(this.uShops[0].shopName != null && this.uShops[0].shopName !="") this.shopName = this.uShops[0].shopName;
         if(this.uShops[0].isVat != null) this.isVat = this.uShops[0].isVat;
         if(this.uShops[0].typeVat != null) this.typeVat = this.uShops[0].typeVat;
         if(this.uShops[0].firstName != null) this.firstName = this.uShops[0].firstName;
         if(this.uShops[0].lastName != null) this.lastName = this.uShops[0].lastName;
         if(this.uShops[0].phoneNumber != null) this.phoneNumber = this.uShops[0].phoneNumber;
         if(this.uShops[0].email != null) this.email = this.uShops[0].email;
         if(this.uShops[0].address != null) this.address = this.uShops[0].address;
         if(this.uShops[0].districtName != null) this.district = this.uShops[0].districtName;
         if(this.uShops[0].borderName != null) this.district = this.uShops[0].borderName;
         if(this.uShops[0].provinceName != null) this.district = this.uShops[0].provinceName;
         if(this.uShops[0].postCode != null) this.postCode = this.uShops[0].postCode;
       }
    });
  }

  ngOnInit(): void {
    this.loading = true;    
    this.thaiAddress.GetThaiAddress().subscribe((json: Array<ThaiAddress>)=>{
      this.dataAddress = json; 
      //console.log(json);
      this.data = json.filter(o => o.province_id == 111);    
      this.loading = false;
    }); 

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id){
         this.mode = false;
         this.getShop(this.id);
      }
      else{
         this.mode = true;
      }
    });

    this.afAuth.authState.subscribe(res => {
      if(res != null)
      {
        if(res.uid != null) this.uid = res.uid;
      }
    });
  }

}
