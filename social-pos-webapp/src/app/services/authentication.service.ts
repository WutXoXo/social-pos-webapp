import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public afAuth:AngularFireAuth) { }
  
  signUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.info(result.user);
      }).catch((error) => {
        console.error(error);
      })
  }

  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
         console.info(result.user);
      }).catch((error) => {
        console.error(error);
      });
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      
    })
  }
}
