import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../../WebTool";

@Injectable({
  providedIn: 'root'
})
export class HeadlineService {

  BASE_URL = rooturl;

  constructor(private http: HttpClient) { }

  getUser(){
    return this.http.get(this.BASE_URL + '/user', {withCredentials: true});
  }

  updateHeadline(newStatus: string) {
    return this.http.put(this.BASE_URL + '/headline', {headline: newStatus}, {withCredentials: true});
  }

  logout(){
    return this.http.put(this.BASE_URL + '/logout', null, {withCredentials: true});
  }
}
