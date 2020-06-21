import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public afAuth:AngularFireAuth) {}
  
  signUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email,password);
  }

  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  verificationEMail(): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    });
  }

  updateDisplayName(displayName): Promise<void>
  {
    return this.afAuth.currentUser.then((user) => {
      return user.updateProfile({
        displayName: displayName
      });
    });
  }
  updatePhotoURL(photoURL) : Promise<void>
  {
    return this.afAuth.currentUser.then((user) => {
      return user.updateProfile({
        photoURL: photoURL
      });
    });
  }

  updatePhoneNumber(phoneNumber) : Promise<void>
  {
    return this.afAuth.currentUser.then((user) => {
      return user.updatePhoneNumber(phoneNumber);
    });
  }

  updatePassword(password) : Promise<void>
  {
    return this.afAuth.currentUser.then((user) => {
      return user.updatePassword(password);
    });
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
