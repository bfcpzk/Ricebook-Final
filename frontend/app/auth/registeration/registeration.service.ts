import { Injectable } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../../WebTool";

export class User{
  netId: string;
  display_name: string;
  email: string;
  phone: string;
  dob: string;
  zipcode: string;
  headline: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterationService {

  constructor(private http: HttpClient) { }

  checkAge(control: FormControl): any{
    const date = new Date();
    const birth = control.value;
    const birthdayTs = new Date(birth);
    const diff = date.getTime() - birthdayTs.getTime();
    const age = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
    return (age >= 18) ? null : {ageChecker: {err: 'Your age is under 18'}};
  }

  checkAccount(control: FormControl): any{
    const account = control.value;
    if(account[0] >= '0' && account[0] <= '9') {
      return {accountNameChecker: {err: 'The first character cannot be number'}};
    }
    for(let i = 1 ; i < account.length ; i++){
      let letter = account[i];
      if(!((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z') || (letter >= '0' && letter <= '9'))) {
        return {accountNameChecker: {err: 'Illgal characters exist'}}
      }
    }
    return null;
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

  checkPassword(controlGroup: FormGroup): any{
    const pass1 = controlGroup.get('pass1').value as FormControl;
    const pass2 = controlGroup.get('pass2').value as FormControl;
    const isEqual = (pass1 == pass2);
    return isEqual ? null : {passValidator: {err: 'The password is not consistent'}}
  }

  createUser(registerForm: FormGroup){
    const formVal = registerForm.value;
    const passwd = formVal['password']['pass1'];
    formVal['password'] = passwd;
    return this.http.post(rooturl + '/register', formVal);
  }
}
