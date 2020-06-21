import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../../services/authentication.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public loading:boolean
  public wrong_password:boolean;
  public user_not_found:boolean;
  public user_other:boolean;
  public user_other_msg:string;

  constructor(private authService: AuthenticationService,private router: Router) { }

  onSubmit(f: NgForm) {
    if(f.valid)
    {
      this.loading = true;
      this.wrong_password = false;
      this.user_not_found = false;
      this.user_other = false;

      this.authService.signIn(f.value.email, f.value.password)
      .then((result) => {
        this.loading = false;
        this.router.navigate(["/app"]);
     }).catch((error) => {
       this.loading = false;
       console.error(error); 
       if(error != null && error.code == "auth/wrong-password") {this.wrong_password = true;}
       else if(error != null && error.code == "auth/user-not-found"){ this.user_not_found = true;}
       else{ this.user_other = true; this.user_other_msg = error.message;}
     });

    }
  }

  ngOnInit(): void {
  }

}
