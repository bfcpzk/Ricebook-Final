import { Injectable } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../auth/registeration/registeration.service";
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../WebTool";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  BASE_URL = rooturl;

  constructor(private http: HttpClient) { }

  getUser(){
    return this.http.get(this.BASE_URL + '/user', {withCredentials: true});
  }

  async onUpdate(updateForm: FormGroup, user: User) {
    const formRawValue = updateForm.getRawValue();
    if(formRawValue.name != '') {
      user.display_name = formRawValue.name;
      await this.http.put(this.BASE_URL + '/display_name', {display_name: formRawValue.name}, {withCredentials: true}).toPromise()
    }
    if(formRawValue.email != '') {
      user.email = formRawValue.email;
      await this.http.put(this.BASE_URL + '/email', {email: formRawValue.email}, {withCredentials: true}).toPromise()
    }
    if(formRawValue.phone != '') {
      user.phone = formRawValue.phone;
      await this.http.put(this.BASE_URL + '/phone', {phone: formRawValue.phone}, {withCredentials: true}).toPromise()
    }
    if(formRawValue.zipcode != '') {
      user.zipcode = formRawValue.zipcode;
      await this.http.put(this.BASE_URL + '/zipcode', {zipcode: formRawValue.zipcode}, {withCredentials: true}).toPromise()
    }
    if(formRawValue.password != '') {
      await this.http.put(this.BASE_URL + '/password', {password: formRawValue.password}, {withCredentials: true}).toPromise()
    }
    updateForm.reset('');
  }

  checkPhone(control: FormControl): any{
    const phone = control.value;
    if(phone == '') return null;
    const pat = /^\d{3}-\d{3}-\d{4}$/;
    const res = pat.test(phone);
    return res ? null : {phoneChecker: {err : 'Phone number is invalid.'}}
  }

  checkZipcode(control: FormControl): any{
    const zipcode = control.value;
    if(zipcode == '') return null;
    const pat = /^\d{5}$/;
    const res = pat.test(zipcode);
    return res ? null : {zipcodeChecker: {err : 'Zipcode is invalid.'}}
  }

  uploadAvatar(fd: FormData){
    return this.http.put(this.BASE_URL + '/uploadAvatar', fd, {withCredentials: true});
  }

  updateAvatar(avatar: string){
    return this.http.put(this.BASE_URL + '/avatar', {avatar: avatar}, {withCredentials: true});
  }

  unlinkAccount(){
    return this.http.get(this.BASE_URL + '/unlinkAccount', {withCredentials: true});
  }
}
