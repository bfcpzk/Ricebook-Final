import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterationService} from './registeration.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css'],
  providers: []
})
export class RegisterationComponent implements OnInit {

  registerForm: FormGroup;

  errMsg: string;

  successMsg: string;

  constructor(private fb : FormBuilder,
              private registerationService: RegisterationService,
              private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.fb.group({
      netId: ['', [Validators.required, Validators.minLength(3), this.registerationService.checkAccount]],
      display_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.registerationService.checkPhone]],
      dob: ['2000-04-23', [this.registerationService.checkAge]],
      zipcode: ['', [Validators.required, this.registerationService.checkZipcode]],
      password: this.fb.group({
        pass1: ['',[Validators.minLength(6)]],
        pass2: ['']
      }, {validator: this.registerationService.checkPassword})
    });
  }

  get reg_netId() { return this.registerForm.get('netId'); }

  get display_name() { return this.registerForm.get('display_name');}

  get email() { return this.registerForm.get('email'); }

  get phone() { return this.registerForm.get('phone'); }

  get dob() { return this.registerForm.get('dob'); }

  get zipcode() { return this.registerForm.get('zipcode'); }

  get pass1() {return this.registerForm.get('password').get('pass1');}

  get pass2() {return this.registerForm.get('password').get('pass2');}

  async toMain(){
    const res = await this.registerationService.createUser(this.registerForm).toPromise();
    if(res['result'] == 'success'){
      this.successMsg = 'register success, please login';
      this.initForm();
      setTimeout(() => {
        this.successMsg = '';
      }, 2000);
    }else{
      this.errMsg = res['result'];
      this.initForm();
      setTimeout(() => {
        this.errMsg = '';
      }, 2000);
    }
  }
}
