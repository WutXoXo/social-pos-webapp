import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading = false;

  constructor(private authService: AuthenticationService,private router: Router) { }

  onSubmit(f: NgForm) {
    if(f.valid)
    {
      this.loading = true;
      this.authService.signIn(f.value.email, f.value.password)
      .then((result) => {
        this.loading = false;
        console.info(result);
     }).catch((error) => {
      this.loading = false;
       console.error(error);
     });
    }
  }

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe(res => {
      if (res != null && res && res.uid) {
        this.router.navigate(["/app"]);
      }
    });
  }

}
