import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ThaiAddress } from '../models/thai-address';


@Injectable({
  providedIn: 'root'
})
export class ThaiAddressService {

  constructor(private httpClient: HttpClient) { }

  public GetThaiAddress(){
    return this.httpClient.get<Array<ThaiAddress>>("/assets/thai-address.min.json");
  }
}
