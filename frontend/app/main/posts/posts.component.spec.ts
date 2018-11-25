import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsComponent } from './posts.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {BsModalService, ComponentLoaderFactory, PositioningService} from "ngx-bootstrap";
import {LoginComponent} from "../../auth/login/login.component";

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let loginComponent: LoginComponent;
  let loginFixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsComponent, LoginComponent ],
      providers: [BsModalService, ComponentLoaderFactory, PositioningService],
      imports:[BrowserModule, FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    loginFixture = TestBed.createComponent(LoginComponent);
    loginComponent = loginFixture.componentInstance;
    loginFixture.detectChanges();
    loginComponent.login('bfcpzk', '123456');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the search keyword', () => {
    component.reset();
    expect(component.searchCondition).toBe('');
  });

  it('should fetch articles for current logged in user', () => {
    const flist = component.getFeedList('zp7');
    for(let i = 0 ; i < flist.length ; i++){
      expect(flist[i].netId).toBe('zp7');
    }
  });

  it('should filter displayed articles by the search keyword', () => {
    component.searchCondition = 'Mike Pan';
    component.feedList = component.getFeedList('zp7');
    component.searchPost();
    expect(component.searchRes.length).toBe(2);
  });

  it('should add articles when adding a follower', () => {
    let pre = 0;
    component.feedList = component.getFeedList('zp7');
    for(let i = 0 ; i < component.feedList.length ; i++){
      if(component.feedList[i].netId == 'jw101')
        pre++;
    }
    let newAdd = 0;
    const obj = {'netId':'jw101', 'flag': 1};
    component.getNetIdFromParent = JSON.stringify(obj);
    for(let i = 0 ; i < component.feedList.length ; i++){
      if(component.feedList[i].netId == 'jw101')
        newAdd++;
    }
    expect(newAdd - pre).toBe(3);
  });

  it('should remove articles when removing a follower', () => {
    let pre = 0;
    component.feedList = component.getFeedList('zp7');
    const tmp = component.getFeedList('jw101');
    for(let i = 0 ; i < tmp.length ; i++){
      if(tmp[i].netId == 'jw101')
        component.feedList.push(tmp[i]);
    }
    let allLen = component.feedList.length;
    const obj = {'netId':'jw101', 'flag': 0};
    component.getNetIdFromParent = JSON.stringify(obj);
    expect(allLen - component.feedList.length).toBe(3);
  });
});
