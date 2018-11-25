import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {rooturl} from "../../WebTool";
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-account-link',
  templateUrl: './account-link.component.html',
  styleUrls: ['./account-link.component.css']
})
export class AccountLinkComponent implements OnInit {

  title: string;

  loginForm: FormGroup;

  errMsg: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              public accountLinkModal: BsModalRef) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      netId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get netId() { return this.loginForm.get('netId');}

  get password() { return this.loginForm.get('password');}

  linkAccount(){
    const user = this.loginForm.value;
    this.http.put(rooturl + '/linkAccount',
      {username: user.netId, password: user.password}, {withCredentials: true}).subscribe((res) => {
      if(res['result'] == 'success'){
        this.router.navigate(['auth']);
        this.accountLinkModal.hide();
      }else{
        this.errMsg = res['result'];
        setTimeout(() => {
          this.errMsg = '';
        }, 2000);
      }
    });
  }
}
