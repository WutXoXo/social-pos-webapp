import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication.service";
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public emailVerified:boolean;
  public photoURL:string;
  public displayName:string;
  public email:string;  
  public uid:string; 
  public phoneNumber:string; 
  public loading:boolean; 

  constructor(private authService: AuthenticationService,private afAuth:AngularFireAuth,private router: Router) { }

  signOut() {
    this.authService.signOut()
    .then((result) => {
      this.loading = false;
      this.router.navigate(["/account/signin"]);
   }).catch((error) => {
    this.loading = false;
     console.error(error);
   });
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(res => {
      if(res != null)
      {
        if(res.emailVerified != null) this.emailVerified = res.emailVerified;
        if(res.photoURL != null) this.photoURL = res.photoURL;
        else this.photoURL = "assets/default-photo-user.png";
        if(res.displayName != null) this.displayName = res.displayName;
        if(res.email != null) this.email = res.email;
        if(res.uid != null) this.uid = res.uid;
        if(res.phoneNumber !=null) this.phoneNumber = res.phoneNumber;
      }
    });
  }

}
