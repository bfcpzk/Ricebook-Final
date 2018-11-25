import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {HeadlineComponent} from "../../main/headline/headline.component";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let other: HeadlineComponent;
  let otherComp: ComponentFixture<HeadlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, HeadlineComponent ],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    otherComp = TestBed.createComponent(HeadlineComponent);
    other = otherComp.componentInstance;
    otherComp.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in a previously registered user (not new users)', () => {
    //spyOn(component, 'isRegisteredUser').and.callFake((uname, passwd) => ((uname == 'bfcpzk') && (passwd == '123456')));
    component.login('zp7', '123456');
    expect(component.loginState).toBe('login success');
  });

  it('should update success message (for displaying login success message to user)', () => {
    component.login('zp7', '123456');
    expect(other.user.display_name).toBe('Mike Pan');
  });

  it('should not login an invalid user', () => {
    component.login('haha', '345678');
    expect(component.loginState).toBe('login failure');
    component.login('', '345678');
    expect(component.loginState).toBe('login failure');
    component.login('haha', '');
    expect(component.loginState).toBe('login failure');
  });

  it('should update error message (for displaying login error mesage to user)', () => {
    component.login('haha', '234232');
    expect(component.errMsg).toBe('invalid user');
  })

  it('should log out a user (login state should be cleared)', () => {
    other.logout();
    expect(localStorage['loginStatus']).toBe(undefined);
  })
});
