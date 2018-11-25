import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {PostsService} from "../main/posts/posts.service";
import {HttpModule} from "@angular/http";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {ProfileService} from "./profile.service";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [ProfileService, HttpClient, HttpHandler],
      imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the user`s profile information', () => {
    component.fetchUser();
    expect(component.user != null).toBe(true);
  })
});
