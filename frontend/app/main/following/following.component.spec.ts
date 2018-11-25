import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingComponent } from './following.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {PostsComponent} from "../posts/posts.component";
import {LoginComponent} from "../../auth/login/login.component";
import {Feed} from "../posts/posts.service";
import {BsModalService, ComponentLoaderFactory, PositioningService} from "ngx-bootstrap";
import {User} from "../../auth/registeration/registeration.service";

describe('FollowingComponent', () => {
  let component: FollowingComponent;
  let fixture: ComponentFixture<FollowingComponent>;
  /*let postsComponent: PostsComponent;
  let postsFixture: ComponentFixture<PostsComponent>;*/

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowingComponent, PostsComponent ],
      providers: [BsModalService, ComponentLoaderFactory, PositioningService],
      imports: [BrowserModule, FormsModule, RouterTestingModule, HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*beforeEach(() => {
    postsFixture = TestBed.createComponent(PostsComponent);
    postsComponent = postsFixture.componentInstance;
    postsFixture.detectChanges();
  });*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add articles when adding a follower', () => {
    component.followers = [{
      "netId": "jh17",
      "name": "John",
      "avatar": "http://n.sinaimg.cn/translate/20170726/Zjd3-fyiiahz2863063.jpg",
      "status": "I'm John"
    }];
    const followerLen = component.followers.length;
    component.user = new User();
    component.user.netId = 'zp7';
    component.addNetId = 'jw101';
    component.addFollower();
    expect(component.followers.length - followerLen).toBe(1);
  });

  it('should remove articles when removing a follower', () => {
    component.followers = [{
      "netId": "jw101",
      "name": "JJ Wang",
      "avatar": "http://n.sinaimg.cn/translate/20170726/Zjd3-fyiiahz2863063.jpg",
      "status": "https://media.licdn.com/dms/image/C4E03AQGKBgLCyi8Kyg/profile-displayphoto-shrink_800_800/0?e=1544054400&v=beta&t=ydqX_tZhjorCIWmKHdXaUr8r_omhloIQNY7HX5Oeu50"
    }];
    component.addNetId = 'jw101';
    component.unfollow('jw101');
    expect(component.followers.length).toBe(0);
  });
});
