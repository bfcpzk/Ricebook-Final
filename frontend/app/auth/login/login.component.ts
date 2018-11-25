import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../../WebTool";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loginState = '';


  errMsg: string;
  constructor(private fb: FormBuilder,
              private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      netId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    const user = this.loginForm.value;
    this.http.post(rooturl + '/login',
      {username: user.netId, password: user.password}, {withCredentials: true})
      .subscribe((data) => {
        if(data['result'] == 'success'){
          //localStorage['loginStatus'] = data['username'];
          this.loginState = 'login success';
          this.router.navigate(['main']);
        }else{
          this.loginState = 'login failure';
          this.errMsg = data['result'];
          setTimeout(() => {
            this.errMsg = '';
          }, 2000);
        }
      });
  }

  get netId() { return this.loginForm.get('netId');}

  get password() { return this.loginForm.get('password');}

  facebook(){
    document.location.href = rooturl + '/facebook';
  }

}
