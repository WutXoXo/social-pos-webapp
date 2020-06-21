import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication.service";
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Guid } from "guid-typescript";
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/profile';
import { ProfileActivity } from 'src/app/models/profileactivity';
import { Observable, Observer } from "rxjs";
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public imageChangedEvent: any = '';
  public croppedImage: any = 'assets/100x100.png';
  public isShowCrop:boolean = false;
  public emailVerified:boolean;
  public retypePassword:string;
  public profile:Profile = new Profile();
  public loading:boolean;
  public imageFileBase64:string|null;
  public imageFile:File|null;
  public imageFile2KB:File|null;
  public task: AngularFireUploadTask;
  
  public percentage: Observable<number>;
  public snapshot: Observable<any>;
  public downloadURL: string;

  constructor(
    private authService: AuthenticationService,
    private afAuth:AngularFireAuth,
    private router: Router,
    private ng2ImgMax: Ng2ImgMaxService,
    private afStorage: AngularFireStorage) 
    {
      this.profile = new Profile();
      this.profile.photoURLActivity = new ProfileActivity();
      this.profile.displayNameActivity = new ProfileActivity();
      this.profile.emailActivity = new ProfileActivity();
      this.profile.emailActivity.iocn = "fa-eye";
      this.profile.phoneNumberActivity = new ProfileActivity();
      this.profile.phoneNumberActivity.iocn = "fa-eye";
      this.profile.passwordActivity = new ProfileActivity();
   }

  onEditDisplayName(activity)
  {
    if(activity.disable == false)
    {
      this.loading = true;
      this.authService.updateDisplayName(this.profile.displayName).then((result) => {    
        activity.setButton(activity.disable); 
        this.loading = false;   
     }).catch((error) => {
       this.loading = false;
     });      
    }
    else
    {
      activity.setButton(activity.disable);
    }
  }

  onEditPhotoURL(photo)
  {
    this.loading = true;
      this.authService.updatePhotoURL(photo).then((result) => {     
        this.loading = false;   
     }).catch((error) => {
       this.loading = false;
     });     
  }

  onEditPhoneNumber(activity)
  {
    if(activity.disable == false)
    {
      this.loading = true;
      this.authService.updatePhoneNumber(this.profile.phoneNumber).then((result) => {    
        activity.setButton(activity.disable); 
        this.loading = false;   
     }).catch((error) => {
       this.loading = false;
     });      
    }
    else
    {
      activity.setButton(activity.disable);
    }
  }

  onEditPassword(activity)
  {
    if(activity.disable == false)
    {
      this.loading = true;
      this.authService.updatePassword(this.profile.password).then((result) => {    
        activity.setButton(activity.disable);
        this.authService.signOut();
        this.router.navigate(["/account/signin"]);
        this.loading = false;   
     }).catch((error) => {
        this.loading = false;
     });      
    }
    else
    {
      activity.setButton(activity.disable);
    }
  }

  verifyPassword(p1,p2)
  {
    if(this.profile.passwordActivity.disable) return false;
    if(p1 == null) return true;
    if(p2 == null) return true;
    if(p1=='') return true;
    if(p2=='') return true;
    if(p1.length < 6) return true;
    if(p2.length < 6) return true;
    if(p1 != p2)return true;
    return false;
  }

  fileChangeEvent(event: any): void {    
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.isShowCrop = true;
    }
    else
    {
      this.isShowCrop = false;
      this.imageFileBase64 = null;
      this.imageFile = null;
      this.imageFile2KB = null;
      this.profile.photoURLActivity.button = "btn-default";
      this.croppedImage = 'assets/100x100.png';  
    }    
  }
  imageCropped(event: ImageCroppedEvent) {    
      this.croppedImage = event.base64;
      if(event.base64 != null) this.imageFileBase64 = event.base64.replace(/^data:image\/(png|jpg);base64,/, "");
      this.createBlobImageFile();      
  }
  imageLoaded() {
    console.log("imageLoaded");
  }
  cropperReady() {
    console.log("cropperReady");
  }
  loadImageFailed() {
    console.log("loadImageFailed");
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
        this.profile.photoURLActivity.button = "btn-success";        
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
        this.profile.photoURLActivity.button = "btn-success";   
      },
      error => {
        console.error( error);
      }
    );
  }

  storageUpload():void{
    this.loading = true;
    const path = `profile/${this.imageFile2KB.name}`;
    const ref = this.afStorage.ref(path);
    this.task = this.afStorage.upload(path, this.imageFile2KB);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        console.log(this.downloadURL);
        this.loading = false;
        this.onEditPhotoURL(this.downloadURL);
        this.profile.photoURL = this.downloadURL;
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

  ngOnInit(): void {
    this.afAuth.authState.subscribe(res => {
      if(res != null)
      {
        if(res.emailVerified != null) this.emailVerified = res.emailVerified;
        
        if(res.photoURL != null) this.profile.photoURL = res.photoURL;
        else this.profile.photoURL = "assets/default-photo-user.png";       

        if(res.displayName != null) this.profile.displayName = res.displayName;
          
        if(res.email != null) this.profile.email = res.email;         

        if(res.uid != null) this.profile.uid = res.uid;
        if(res.phoneNumber !=null) this.profile.phoneNumber = res.phoneNumber;
      }
    });
  }
}
