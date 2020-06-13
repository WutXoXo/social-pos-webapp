import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Social POS';
  constructor(private afAuth:AngularFireAuth,private router: Router){}

  ngOnInit(){
    this.afAuth.authState.subscribe(res => {
      if (res == null) {
        this.router.navigate(["/login"]);
      }
    });
  }
}
