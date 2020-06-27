import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileSubjectService {
  HeaderProfile: Subject<Profile> = new Subject<Profile>();
  constructor() { }
}
