import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ProfileComponent} from "./profile/profile.component";
import {MainComponent} from "./main/main.component";
import {AuthComponent} from "./auth/auth.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterationComponent} from "./auth/registeration/registeration.component";
import {FollowingComponent} from "./main/following/following.component";
import {HeadlineComponent} from "./main/headline/headline.component";
import {PostsComponent} from "./main/posts/posts.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommentsComponent} from "./main/posts/comments/comments.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ProfileComponent,
        MainComponent,
        AuthComponent,
        LoginComponent,
        RegisterationComponent,
        FollowingComponent,
        HeadlineComponent,
        PostsComponent,
        CommentsComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
