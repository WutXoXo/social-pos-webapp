import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../../services/authentication.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public loading:boolean;
  public displayName:string;
  public email:string;
  public password:string;
  public confirmPassword:string;  
  public terms:boolean; 

  constructor(private authService: AuthenticationService,private router: Router) { }

  onSubmit(f: NgForm) {
    if(f.valid)
    {
      this.loading = true;
      this.authService.signUp(f.value.email, f.value.password)
      .then((result) => {        
        this.authService.updateDisplayName(f.value.displayName);
        this.authService.verificationEMail();
        this.loading = false;
        this.router.navigate(["/app"]);
     }).catch((error) => {
       this.loading = false;
       console.error(error);
     });
    }
  }

  ngOnInit(): void {
    // this.authService.afAuth.authState.subscribe(res => {
    //   if (res != null && res && res.uid) {
    //     this.router.navigate(["/app"]);
    //   }
    // });
  }

}
